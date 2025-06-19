import React, { useState } from "react";

// PUBLIC_INTERFACE
function FeedbackForm({ onSubmit, message }) {
  const [feedback, setFeedback] = useState("");

  // On submit handler for feedback
  function handleSubmit(e) {
    e.preventDefault();
    if (!feedback.trim()) return;
    onSubmit(feedback.trim());
    setFeedback("");
  }

  return (
    <form className="nsw-feedback-form" onSubmit={handleSubmit}>
      <label className="nsw-feedback-label" htmlFor="feedback-field">
        How did your walk feel? Suggestions welcome!
      </label>
      <textarea
        className="nsw-feedback-area"
        id="feedback-field"
        placeholder="Share your experience or suggestions..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        required
        maxLength={500}
      />
      <button className="nsw-feedback-btn" type="submit" disabled={!feedback.trim() || !!message}>
        Submit Feedback
      </button>
      <div className="nsw-feedback-msg">
        {message}
      </div>
    </form>
  );
}

export default FeedbackForm;
