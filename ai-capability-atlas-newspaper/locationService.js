/**
 * Location Service - Google Places API Integration
 * Provides precise location details for permit queries
 */

const axios = require('axios');

class LocationService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Get detailed location information from an address
   */
  async getLocationDetails(address) {
    try {
      // Step 1: Geocode the address
      console.log('[LocationService] Geocoding address:', address);
      const geocodeUrl = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
      
      const geocodeResponse = await axios.get(geocodeUrl);
      const data = geocodeResponse.data;

      console.log('[LocationService] Geocode status:', data.status);

      if (data.status === 'REQUEST_DENIED') {
        console.error('[LocationService] Request denied:', data.error_message);
        throw new Error(`Google API request denied: ${data.error_message || 'Check API key and enabled APIs'}`);
      }

      if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error(`Address not found (status: ${data.status})`);
      }

      const result = data.results[0];
      const components = result.address_components;

      // Step 2: Extract components
      const location = {
        fullAddress: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        placeId: result.place_id,
        
        // Extract jurisdiction details
        streetNumber: this.extractComponent(components, 'street_number'),
        street: this.extractComponent(components, 'route'),
        neighborhood: this.extractComponent(components, 'neighborhood'),
        city: this.extractComponent(components, 'locality'),
        county: this.extractComponent(components, 'administrative_area_level_2'),
        state: this.extractComponent(components, 'administrative_area_level_1'),
        stateShort: this.extractComponent(components, 'administrative_area_level_1', 'short'),
        zipCode: this.extractComponent(components, 'postal_code'),
        country: this.extractComponent(components, 'country'),
        
        // Metadata
        locationType: result.geometry.location_type,
        types: result.types
      };

      // Step 3: Check if in city limits (heuristic)
      location.likelyCityLimits = this.isLikelyCityLimits(result);

      return location;
    } catch (error) {
      console.error('Location lookup error:', error);
      throw new Error(`Failed to lookup address: ${error.message}`);
    }
  }

  /**
   * Find the nearest permit office
   */
  async findPermitOffice(location) {
    try {
      const jurisdiction = location.likelyCityLimits ? location.city : location.county;
      const searchQuery = `building permit office ${jurisdiction} ${location.stateShort}`;

      const fields = 'name,formatted_address,geometry,place_id';
      const searchUrl = `${this.baseUrl}/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=${fields}&locationbias=point:${location.lat},${location.lng}&key=${this.apiKey}`;
      
      const searchResponse = await axios.get(searchUrl);

      if (searchResponse.data.status !== 'OK' || searchResponse.data.candidates.length === 0) {
        return null;
      }

      const office = searchResponse.data.candidates[0];

      // Get detailed info (phone, website, hours)
      const detailFields = 'name,formatted_address,formatted_phone_number,website,opening_hours,geometry';
      const detailsUrl = `${this.baseUrl}/place/details/json?place_id=${office.place_id}&fields=${detailFields}&key=${this.apiKey}`;
      
      const detailsResponse = await axios.get(detailsUrl);

      if (detailsResponse.data.status !== 'OK') {
        return null;
      }

      const details = detailsResponse.data.result;

      return {
        name: details.name,
        address: details.formatted_address,
        phone: details.formatted_phone_number || 'Not available',
        website: details.website || null,
        hours: details.opening_hours?.weekday_text || null,
        location: {
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng
        },
        distanceMiles: this.calculateDistance(
          location.lat,
          location.lng,
          details.geometry.location.lat,
          details.geometry.location.lng
        )
      };
    } catch (error) {
      console.error('Permit office lookup error:', error);
      return null;
    }
  }

  /**
   * Check for special districts (historic, HOA, etc.)
   */
  async detectSpecialDistricts(location) {
    const districts = [];

    try {
      // Search for historic districts nearby
      const query = `historic district ${location.neighborhood || location.city} ${location.stateShort}`;
      const fields = 'name,geometry,types';
      const searchUrl = `${this.baseUrl}/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${fields}&locationbias=point:${location.lat},${location.lng}&key=${this.apiKey}`;
      
      const historicSearch = await axios.get(searchUrl);

      if (historicSearch.data.status === 'OK' && historicSearch.data.candidates.length > 0) {
        const historic = historicSearch.data.candidates[0];
        const distance = this.calculateDistance(
          location.lat,
          location.lng,
          historic.geometry.location.lat,
          historic.geometry.location.lng
        );

        // Only include if within 0.5 miles
        if (distance < 0.5) {
          districts.push({
            type: 'historic',
            name: historic.name,
            requiresReview: true,
            note: 'Additional design review may be required'
          });
        }
      }
    } catch (error) {
      console.error('Special district detection error:', error);
    }

    return districts;
  }

  /**
   * Extract address component by type
   */
  extractComponent(components, type, format = 'long') {
    const comp = components.find(c => c.types.includes(type));
    if (!comp) return null;
    return format === 'short' ? comp.short_name : comp.long_name;
  }

  /**
   * Heuristic to determine if address is likely in city limits
   */
  isLikelyCityLimits(geocodeResult) {
    const types = geocodeResult.types;
    // If result type includes 'street_address' or 'premise' in a city, likely in limits
    // If it's 'route' or 'intersection', less certain
    return types.includes('street_address') || types.includes('premise');
  }

  /**
   * Calculate distance between two points in miles
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = LocationService;
