import React from "react";

// PUBLIC_INTERFACE
function MapSection({ location, route }) {
  // Util for rendering minimalistic route line using SVG
  function renderMockMap() {
    // Map area, 300x220, fake marker on current location, plus “route” if given
    const mapWidth = 300;
    const mapHeight = 220;

    // Normalize coordinates for demo (not geographically accurate)
    const user = { x: mapWidth * 0.5, y: mapHeight * 0.7 };
    const routeLine = route
      ? [
          { x: user.x, y: user.y },
          { x: user.x + 48, y: user.y - 70 }
        ]
      : null;

    return (
      <svg width={mapWidth} height={mapHeight}>
        {/* Route line */}
        {routeLine &&
          <polyline
            className="nsw-map-svg-route"
            points={routeLine.map(p => `${p.x},${p.y}`).join(" ")}
          />
        }
        {/* User marker */}
        <circle cx={user.x} cy={user.y} r="13" fill="#4caf50" stroke="#222" strokeWidth="2"/>
        <text x={user.x} y={user.y + 5} textAnchor="middle" fontSize="0.93em" fill="#fff" fontWeight="bold">You</text>
        {/* Route dest marker */}
        {routeLine && <circle cx={routeLine[1].x} cy={routeLine[1].y} r="10" fill="#ffc107" stroke="#888" strokeWidth="1.6"/>}
      </svg>
    );
  }

  return (
    <div className="nsw-map-section">
      <div style={{ fontWeight: 500, color: "#4CAF50" }}>Your Route Map</div>
      <div className="nsw-map-placeholder">
        {location
          ? renderMockMap()
          : <span>Locating you via GPS...</span>
        }
      </div>
      <div style={{ fontSize: "0.98em", marginTop: 4, color: "#666" }}>
        {location
          ? `Current Location: (${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)})`
          : "Please allow location permission."
        }
      </div>
    </div>
  );
}

export default MapSection;
