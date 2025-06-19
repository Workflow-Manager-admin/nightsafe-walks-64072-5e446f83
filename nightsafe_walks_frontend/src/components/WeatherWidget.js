import React from "react";

// PUBLIC_INTERFACE
function WeatherWidget({ weather }) {
  function weatherIcon(desc) {
    if (!desc) return <span className="nsw-weather-icon">🌙</span>;
    const d = desc.toLowerCase();
    if (d.includes("clear")) return <span className="nsw-weather-icon">🌙</span>;
    if (d.includes("cloud")) return <span className="nsw-weather-icon">☁️</span>;
    if (d.includes("rain")) return <span className="nsw-weather-icon">🌧️</span>;
    if (d.includes("snow")) return <span className="nsw-weather-icon">❄️</span>;
    return <span className="nsw-weather-icon">⛅️</span>;
  }
  return (
    <div className="nsw-weather-widget">
      {weather
        ? (
          <>
            {weatherIcon(weather.description)}
            <div className="nsw-weather-temp">{weather.temp}</div>
            <div className="nsw-weather-desc">{weather.description}</div>
          </>
        )
        : (
          <>
            <span className="nsw-weather-icon">⏳</span>
            <div className="nsw-weather-desc">Fetching weather...</div>
          </>
        )
      }
    </div>
  );
}

export default WeatherWidget;
