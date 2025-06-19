import React, { useState, useEffect } from "react";
import "./App.css";
import MapSection from "./components/MapSection";
import WeatherWidget from "./components/WeatherWidget";
import RouteSafetyPanel from "./components/RouteSafetyPanel";
import SOSButton from "./components/SOSButton";
import FeedbackForm from "./components/FeedbackForm";

// PUBLIC_INTERFACE
function App() {
  // Global app state for location, route, SOS/feedback info
  const [location, setLocation] = useState(null);
  const [routeSafety, setRouteSafety] = useState(null);
  const [sosStatus, setSosStatus] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Fetch real-time location on mount
  useEffect(() => {
    // PUBLIC_INTERFACE
    function fetchLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            setLocation(null);
          }
        );
      } else {
        setLocation(null);
      }
    }
    fetchLocation();
  }, []);

  // Fetch safest route info when location changes
  useEffect(() => {
    // PUBLIC_INTERFACE
    async function fetchRouteSafety(coords) {
      if (!coords) {
        setRouteSafety(null);
        return;
      }
      // Simulated fetch: Replace with real Route/Crime Safety API
      const routeData = {
        summary: "Safest route is via Main St. Low crime, well-lit.",
        routeCoordinates: [
          { lat: coords.lat, lng: coords.lng },
          { lat: coords.lat + 0.002, lng: coords.lng + 0.005 },
        ],
        crimeReports: [
          { type: "Theft", time: "22:15", loc: "2 blocks east" },
        ],
      };
      setRouteSafety(routeData);
    }
    fetchRouteSafety(location);
  }, [location]);

  // PUBLIC_INTERFACE
  const handleSendSOS = async () => {
    // Simulated API SOS; replace with real endpoint as needed
    setSosStatus("sending");
    setTimeout(() => {
      setSosStatus("sent");
      setTimeout(() => setSosStatus(null), 3000);
    }, 1000);
  };

  // PUBLIC_INTERFACE
  const handleFeedbackSubmit = async (feedbackText) => {
    setFeedbackMessage("Sending...");
    setTimeout(() => {
      setFeedbackMessage("Thank you for your feedback!");
      setTimeout(() => setFeedbackMessage(null), 2000);
    }, 1000);
  };

  return (
    <div className="nsw-app">
      <nav className="nsw-navbar">
        <div className="nsw-container nsw-navbar-wrap">
          <span className="nsw-logo">
            <span className="nsw-logo-icon">&#128161;</span>
            NightSafe Walks
          </span>
          <span className="nsw-tagline">Feel safe. Walk smart.</span>
        </div>
      </nav>
      <main className="nsw-main">
        <div className="nsw-container nsw-main-content">
          <section className="nsw-top-row">
            <MapSection location={location} route={routeSafety?.routeCoordinates} />
            <aside className="nsw-side-widgets">
              <WeatherWidget location={location} />
              <RouteSafetyPanel
                routeSafety={routeSafety}
                loading={!routeSafety && location}
              />
              <SOSButton
                onSendSOS={handleSendSOS}
                status={sosStatus}
              />
            </aside>
          </section>
          <section className="nsw-feedback-row">
            <FeedbackForm
              onSubmit={handleFeedbackSubmit}
              message={feedbackMessage}
            />
          </section>
        </div>
      </main>
      <footer className="nsw-footer">
        NightSafe Walks &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
