import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * WeatherWidget fetches and displays the current weather for the user's actual GPS location.
 * Uses public API (OpenWeatherMap One Call or Current Weather) to fetch real data using coordinates.
 *
 * Configuration:
 *   - You must provide an OpenWeatherMap API key below as WEATHER_API_KEY. (Sign up free: https://openweathermap.org/api)
 *     For security, consider setting this in a .env file for production.
 *   - Optionally, set units to "metric" (°C) or "imperial" (°F).
 *
 * Props:
 *   - weather (not required): kept for backwards compatibility; replaced by internal fetch logic.
 */

const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; // <-- Put your real OpenWeatherMap API key here.
const UNITS = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit

function WeatherWidget({ weather: _legacyProp, location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Fetch weather on mount or when location changes
  useEffect(() => {
    // Only fetch if real coordinates are available
    if (!location?.lat || !location?.lng) {
      setWeather(null);
      setFetchError("");
      setLoading(false);
      return;
    }

    async function fetchWeather() {
      setLoading(true);
      setFetchError("");
      setWeather(null);

      try {
        // OpenWeatherMap "Current Weather" API example:
        // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=${UNITS}`;

        const resp = await fetch(url);
        if (!resp.ok) {
          throw new Error(`Weather API error (${resp.status})`);
        }
        const data = await resp.json();

        setWeather({
          temp: data.main && typeof data.main.temp === "number"
            ? (Math.round(data.main.temp) + (UNITS==="metric" ? "°C" : "°F"))
            : "N/A",
          description: data.weather && data.weather[0]?.description
            ? capitalizeDesc(data.weather[0].description)
            : "Unknown",
          icon: data.weather && data.weather[0]?.icon
            ? data.weather[0].icon
            : undefined
        });
      } catch (e) {
        setFetchError("Could not fetch live weather.");
        setWeather(null);
      }
      setLoading(false);
    }
    fetchWeather();
  }, [location]);

  function weatherIcon(desc, iconCode) {
    if (iconCode) {
      // OpenWeatherMap gives icon code; use its CDN (optional: for production consider CDN fallback)
      // Example: http://openweathermap.org/img/wn/10d@2x.png
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

  return (
    <div className="nsw-weather-widget">
      {/* Show loading/error states, then weather data */}
      {loading && (
        <>
          <span className="nsw-weather-icon">⏳</span>
          <div className="nsw-weather-desc">Fetching weather...</div>
        </>
      )}
      {fetchError && !loading && (
        <>
          <span className="nsw-weather-icon">⚠️</span>
          <div className="nsw-weather-desc">{fetchError}</div>
        </>
      )}
      {!loading && !fetchError && weather && (
        <>
          {weatherIcon(weather.description, weather.icon)}
          <div className="nsw-weather-temp">{weather.temp}</div>
          <div className="nsw-weather-desc">{weather.description}</div>
        </>
      )}
      {/* If not loading/fetchError and no weather: user hasn't granted location yet. */}
      {!loading && !fetchError && !weather && (
        <>
          <span className="nsw-weather-icon">⚲</span>
          <div className="nsw-weather-desc">Waiting for location...</div>
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
