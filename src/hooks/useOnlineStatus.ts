import { useState, useEffect, useCallback } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Track that we came back online (useful for showing "back online" message)
      if (!navigator.onLine === false) {
        setWasOffline(true);
        // Reset after a delay
        setTimeout(() => setWasOffline(false), 3000);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false;
    }
    
    // Optional: Do a real network check
    try {
      const response = await fetch("/favicon.ico", { 
        method: "HEAD",
        cache: "no-store" 
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return { isOnline, wasOffline, checkConnection };
}
