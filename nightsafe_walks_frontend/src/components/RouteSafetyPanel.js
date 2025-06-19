import React from "react";

// PUBLIC_INTERFACE
function RouteSafetyPanel({ routeSafety, loading }) {
  return (
    <div className="nsw-route-safety-panel">
      <div className="nsw-route-title">Route Safety Guidance</div>
      {loading && !routeSafety && (
        <div>Analyzing for the safest route...</div>
      )}
      {routeSafety && (
        <>
          <div className="nsw-route-summary">{routeSafety.summary}</div>
          {routeSafety.crimeReports && routeSafety.crimeReports.length > 0 && (
            <ul className="nsw-crime-list">
              {routeSafety.crimeReports.map((r, idx) => (
                <li key={idx}>{r.type} reported at {r.time} ({r.loc})</li>
              ))}
            </ul>
          )}
        </>
      )}
      {!loading && !routeSafety && (
        <div>No location available. Map cannot suggest safe routes.</div>
      )}
    </div>
  );
}

export default RouteSafetyPanel;
