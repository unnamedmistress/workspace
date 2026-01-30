const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });

setGlobalOptions({ maxInstances: 10 });

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const GOOGLE_PLACES_API_KEY = defineSecret("GOOGLE_PLACES_API_KEY");

exports.openaiChat = onRequest({ secrets: [OPENAI_API_KEY] }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const openaiKey = OPENAI_API_KEY.value();
    if (!openaiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
    }

    try {
      const { messages } = req.body || {};
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "messages must be an array" });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("OpenAI error", errorText);
        return res.status(500).json({ error: "OpenAI request failed" });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      logger.error("OpenAI request error", error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
});

exports.placesAutocomplete = onRequest({ secrets: [GOOGLE_PLACES_API_KEY] }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const placesKey = GOOGLE_PLACES_API_KEY.value();
    if (!placesKey) {
      return res.status(500).json({ error: "GOOGLE_PLACES_API_KEY not configured" });
    }

    const input = req.query.input;
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "input query param required" });
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.set("input", input);
      url.searchParams.set("key", placesKey);
      url.searchParams.set("components", "country:us");

      const response = await fetch(url.toString());
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      logger.error("Places autocomplete error", error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
});

exports.placeDetails = onRequest({ secrets: [GOOGLE_PLACES_API_KEY] }, async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const placesKey = GOOGLE_PLACES_API_KEY.value();
    if (!placesKey) {
      return res.status(500).json({ error: "GOOGLE_PLACES_API_KEY not configured" });
    }

    const placeId = req.query.placeId;
    if (!placeId || typeof placeId !== "string") {
      return res.status(400).json({ error: "placeId query param required" });
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("fields", "formatted_address,address_component,geometry");
      url.searchParams.set("key", placesKey);

      const response = await fetch(url.toString());
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      logger.error("Places details error", error);
      return res.status(500).json({ error: "Unexpected server error" });
    }
  });
});
