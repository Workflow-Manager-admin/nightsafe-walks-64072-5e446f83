import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * MapSection displays the user's current real-time location using the browser Geolocation API.
 * The component renders a minimal map representation with the user's coordinates and a route.
 * All mock/demo logic is removed; location and route visualization is now based on real data.
 * 
 * @param {Object} location - Object with lat/lng (from geolocation API)
 * @param {Array} route - List of coordinates for route polyline
 */
function MapSection({ location, route }) {
  // For potential error handling (e.g., permissions/location denied)
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!location && !navigator.geolocation) {
      setErrorMsg("Geolocation not available.");
    } else if (!location) {
      setErrorMsg(""); // awaiting location
    } else {
      setErrorMsg(""); // got location
    }
  }, [location]);

  // Minimal 2D "map": user and route, live coordinates
  function renderSimpleMap() {
    // Canvas params
    const mapWidth = 300, mapHeight = 220;
    const borderPad = 20;

    let points = [];
    if (route && Array.isArray(route) && route.length > 0) {
      points = route;
    } else if (location) {
      points = [location];
    }

    // Normalize to fit "map" (simple: fit based on min/max lat/lng in provided data)
    let minLat = location?.lat ?? 0, maxLat = location?.lat ?? 0, minLng = location?.lng ?? 0, maxLng = location?.lng ?? 0;
    points.forEach(p => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });
    // Prevent "zero range"
    if (maxLat - minLat < 0.0001) { minLat -= 0.00005; maxLat += 0.00005; }
    if (maxLng - minLng < 0.0001) { minLng -= 0.00005; maxLng += 0.00005; }

    // Convert lat/lng => SVG coords (y is reversed: north is up)
    function toXY({lat, lng}) {
      return {
        x: borderPad + ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 2 * borderPad),
        y: borderPad + ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 2 * borderPad)
      };
    }

    const svgRoute = (points.length > 1)
      ? points.map(toXY).map(p => `${p.x},${p.y}`).join(" ")
      : null;
    const userXY = toXY(points[0] || {lat:0,lng:0});
    const destXY = points.length > 1 ? toXY(points[points.length-1]) : null;

    return (
      <svg width={mapWidth} height={mapHeight}>
        {/* Route polyline */}
        {svgRoute && (
          <polyline
            className="nsw-map-svg-route"
            points={svgRoute}
          />
        )}
        {/* User marker */}
        {location &&
          <>
            <circle cx={userXY.x} cy={userXY.y} r="13" fill="#4caf50" stroke="#222" strokeWidth="2"/>
            <text x={userXY.x} y={userXY.y + 5} textAnchor="middle" fontSize="0.93em" fill="#fff" fontWeight="bold">You</text>
          </>
        }
        {/* Route destination marker */}
        {destXY && (
          <circle cx={destXY.x} cy={destXY.y} r="10" fill="#ffc107" stroke="#888" strokeWidth="1.6"/>
        )}
      </svg>
    );
  }

  return (
    <div className="nsw-map-section">
      <div style={{ fontWeight: 500, color: "#4CAF50" }}>Your Route Map</div>
      <div className="nsw-map-placeholder">
        {!location && !errorMsg && (
          <span>Locating you via GPS...</span>
        )}
        {!location && errorMsg && (
          <span style={{ color: "#f44336" }}>{errorMsg}</span>
        )}
        {location && renderSimpleMap()}
      </div>
      <div style={{ fontSize: "0.98em", marginTop: 4, color: "#666" }}>
        {location
          ? `Current Location: (${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)})`
          : errorMsg
            ? errorMsg
            : "Please allow location permission."
        }
      </div>
      <div style={{ fontSize: "0.92em", color: "#aaa" }}>
        {/* ProTip for development/future: This component uses the browser's Geolocation API via props.location. 
            For reliable results, use localhost or https (browsers require HTTPS for geolocation).
        */}
      </div>
    </div>
  );
}

export default MapSection;
