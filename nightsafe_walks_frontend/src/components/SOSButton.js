import React from "react";

// PUBLIC_INTERFACE
function SOSButton({ onSendSOS, status }) {
  return (
    <div className="nsw-sos-btn-box">
      <button
        className="nsw-sos-btn"
        disabled={status === "sending" || status === "sent"}
        onClick={onSendSOS}
        aria-label="Send SOS alert"
      >
        <span role="img" aria-label="sos">🚨</span> Send SOS
      </button>
      {status === "sending" && (
        <div className="nsw-sos-status">Sending SOS...</div>
      )}
      {status === "sent" && (
        <div className="nsw-sos-status">SOS sent. Help is on the way!</div>
      )}
    </div>
  );
}

export default SOSButton;
