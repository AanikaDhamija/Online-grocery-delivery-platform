import React from 'react';
import "../STYLES/Offers.css";

function Offers() {
  return (
    <section className="offers" id="offers-section">
      <div className="offers-banner">
        <span className="offers-tag animate-pop">🎉 Limited Time Offer</span>
        <h2 className="offers-title animate-pop">
          Get <span className="highlight">20% Off</span> Your First Order!
        </h2>
        <p className="offers-subtext">
          Fresh groceries delivered to your door. Use code <strong>FRESH20</strong> at checkout.
        </p>
      </div>
    </section>
  );
}

export default Offers;
