import React, { useState } from "react";
import MySubscriptionModal from "./MySubscriptionModal";
import "../STYLES/Navbar.css";

export default function UserProfileBox({ user, onLogout }) {
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  return (
    <div className="user-profile-box" style={{padding:24, minWidth:320}}>
      <h2 style={{marginTop:0, marginBottom:12}}>Hi, {user.name}</h2>
      <div style={{marginBottom:24, color:'#6b7280', fontSize:15}}>{user.email}</div>
      <button
        className="mysub-btn"
        style={{
          background: "linear-gradient(90deg, #10b981, #34d399)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "0.5rem 1.2rem",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: 18
        }}
        onClick={() => setSubModalOpen(true)}
      >
        My Subscription
      </button>
      <br />
      <button onClick={onLogout} className="logout-button" style={{marginTop:8}}>Logout</button>
      {isSubModalOpen && (
        <MySubscriptionModal onClose={() => setSubModalOpen(false)} />
      )}
    </div>
  );
}
