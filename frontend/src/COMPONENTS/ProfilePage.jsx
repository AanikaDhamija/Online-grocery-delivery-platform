import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ marginBottom: 24 }}>User Profile</h2>
      {/* You can add more user info here if needed */}
      <button
        style={{
          background: "linear-gradient(90deg, #10b981, #34d399)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "0.5rem 1.2rem",
          fontWeight: 600,
          fontSize: "1rem",
          marginBottom: 16,
          cursor: "pointer"
        }}
        onClick={() => navigate("/my-subscription")}
      >
        My Subscription
      </button>
    </div>
  );
}
