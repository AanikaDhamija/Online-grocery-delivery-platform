import React from "react";
import "../STYLES/HeroSection.css";

export default function HeroSection() {
  // helper scroll function to avoid repeating code
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div  id="hero" className="hero-container">
      <section
        className="hero-section"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
        }}
      >
        {/* --- TEXT CONTENT IS NOW FIRST (ON THE LEFT) --- */}
        <div className="hero-content">
          <h1>
            Groceries at <br />
            Your Door in{" "}
            <span className="highlight-minutes">Minutes</span>
          </h1>
          <p>
            We hand-pick the best produce and pantry essentials, bringing them
            straight to your table in minutes.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => scrollToSection("fresh-products")}
            >
              Shop Now
            </button>

            <button
              className="btn-secondary"
              onClick={() => scrollToSection("offers-section")}
            >
              View Offers
            </button>
          </div>

          <div className="hero-features">
            <span>🟢 15-min Delivery</span>
            <span>🟡 Best Prices</span>
            <span>🟠 10k+ Products</span>
          </div>
        </div>

        {/* --- IMAGE IS NOW SECOND (ON THE RIGHT) --- */}
        <div className="hero-image-container">
          <img
            src="/images/grocery_bag.png"
            alt="Groceries in a bag"
            className="hero-image"
          />
        </div>
      </section>
    </div>
  );
}
