import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * WeatherWidget fetches and displays the current weather for the user's actual GPS location.
 * Enhanced with explicit user-facing UI for: missing API key, fetch/network/API errors, and persistent unavailable/fallback states.
 * 
 * @param {Object} location - Object with lat/lng (from geolocation API in parent)
 */
const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY || "YOUR_OPENWEATHERMAP_API_KEY_HERE"; // <-- For security, recommend using env variable.
const UNITS = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit

/**
 * PUBLIC_INTERFACE
 * WeatherWidget fetches and displays the current weather for the user's actual GPS location.
 * Now enhanced to avoid stuck states if location permission was recently granted, and offers a reload option.
 * @param {Object} location - Object with lat/lng (from geolocation API in parent)
 */
function WeatherWidget({ weather: _legacyProp, location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    // Only fetch if real coordinates and API key is present
    let didCancel = false;
    setWeather(null);
    setFetchError("");
    setApiKeyError("");
    setLoading(false);

    if (!location?.lat || !location?.lng) {
      setLoading(false);
      return;
    }

    if (
      !WEATHER_API_KEY ||
      WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY_HERE" ||
      WEATHER_API_KEY === "xxx" ||
      WEATHER_API_KEY.trim().length < 10
    ) {
      setApiKeyError(
        "Weather service unavailable (API key missing or invalid). Please contact admin or set a valid weather API key."
      );
      setLoading(false);
      return;
    }

    async function fetchWeather() {
      setLoading(true);
      setFetchError("");
      setApiKeyError("");
      setWeather(null);

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=${UNITS}`;

        const resp = await fetch(url);
        if (!resp.ok) {
          if (resp.status === 401 || resp.status === 403) {
            setApiKeyError("Weather API key is invalid or unauthorized. Please set a correct key.");
            setWeather(null);
            setLoading(false);
            return;
          } else if (resp.status === 429) {
            setFetchError("Weather API rate limit reached. Try again later.");
            setWeather(null);
            setLoading(false);
            return;
          }
          throw new Error(`Weather API error (${resp.status})`);
        }
        const data = await resp.json();
        if (!didCancel) {
          // Defensive: check success shape
          if (!data || !data.main || typeof data.main.temp !== "number" || !data.weather || !Array.isArray(data.weather)) {
            setFetchError("Weather data temporarily unavailable.");
            setWeather(null);
          } else {
            setWeather({
              temp: (Math.round(data.main.temp) + (UNITS === "metric" ? "°C" : "°F")),
              description: capitalizeDesc(data.weather[0]?.description) || "Unknown",
              icon: data.weather[0]?.icon,
            });
          }
        }
      } catch (e) {
        if (!didCancel) {
          setFetchError(
            typeof e?.message === "string"
              ? `Could not fetch live weather: ${e.message}`
              : "Could not fetch live weather."
          );
          setWeather(null);
        }
      }
      if (!didCancel) setLoading(false);
    }
    fetchWeather();

    // Cleanup if unmounted
    return () => { didCancel = true; };
    // Also depend on reloadTick: allows manual reload
  }, [location, reloadTick]);

  function weatherIcon(desc, iconCode) {
    if (iconCode) {
      return <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} alt={desc || "weather"} className="nsw-weather-icon" style={{verticalAlign: "middle"}} />;
    }
    if (!desc) return <span className="nsw-weather-icon">🌙</span>;
    const d = desc.toLowerCase();
    if (d.includes("clear")) return <span className="nsw-weather-icon">🌙</span>;
    if (d.includes("cloud")) return <span className="nsw-weather-icon">☁️</span>;
    if (d.includes("rain")) return <span className="nsw-weather-icon">🌧️</span>;
    if (d.includes("snow")) return <span className="nsw-weather-icon">❄️</span>;
    return <span className="nsw-weather-icon">⛅️</span>;
  }

  function capitalizeDesc(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  // Reload handler to refetch weather manually (in case location permission was just granted etc)
  const handleReloadWeather = () => {
    setReloadTick(rt => rt + 1);
  };

  return (
    <div className="nsw-weather-widget">
      {/* Show API key/config error if present */}
      {apiKeyError && (
        <>
          <span className="nsw-weather-icon">❌</span>
          <div className="nsw-weather-desc" style={{ color: "#e53935" }}>{apiKeyError}</div>
          <button style={{ marginTop: 8 }} className="nsw-feedback-btn" onClick={handleReloadWeather}>Retry</button>
        </>
      )}
      {!apiKeyError && loading && (
        <>
          <span className="nsw-weather-icon">⏳</span>
          <div className="nsw-weather-desc">Fetching weather...</div>
        </>
      )}
      {fetchError && !loading && !apiKeyError && (
        <>
          <span className="nsw-weather-icon">⚠️</span>
          <div className="nsw-weather-desc">{fetchError}</div>
          <button style={{ marginTop: 8 }} className="nsw-feedback-btn" onClick={handleReloadWeather}>Retry</button>
        </>
      )}
      {!loading && !fetchError && !apiKeyError && weather && (
        <>
          {weatherIcon(weather.description, weather.icon)}
          <div className="nsw-weather-temp">{weather.temp}</div>
          <div className="nsw-weather-desc">{weather.description}</div>
          <button style={{ marginTop: 8 }} className="nsw-feedback-btn" onClick={handleReloadWeather}>Refresh</button>
        </>
      )}
      {/* If not loading/fetchError/API key and no weather: user hasn't granted location yet. */}
      {!loading && !fetchError && !apiKeyError && !weather && (
        <>
          <span className="nsw-weather-icon">⚲</span>
          <div className="nsw-weather-desc">Waiting for location...</div>
          <button style={{ marginTop: 8 }} className="nsw-feedback-btn" onClick={handleReloadWeather}>Reload</button>
        </>
      )}
      <div style={{ fontSize: "0.9em", color: "#888", marginTop: "0.33em" }}>
        {/* For API integration: Set your OpenWeatherMap API key above.
            For best security in production, use an environment variable. */}
      </div>
    </div>
  );
}

export default WeatherWidget;
