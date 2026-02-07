import React from "react";
import MySubscriptionModal from "./MySubscriptionModal";

export default function MySubscriptionPage() {
  // This page just renders the modal content directly (not as a modal)
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ marginBottom: 24 }}>My Subscription</h2>
      <MySubscriptionModal asPage={true} />
    </div>
  );
}
