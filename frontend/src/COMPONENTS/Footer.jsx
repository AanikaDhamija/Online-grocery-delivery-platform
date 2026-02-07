import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-logo">SpeedyFresh</h3>
          <p>Your trusted partner for fresh groceries delivered in minutes. Quality, speed, and convenience at your doorstep.</p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Categories</h4>
          <ul>
            <li><a href="#">Fruits & Vegetables</a></li>
            <li><a href="#">Dairy Products</a></li>
            <li><a href="#">Beverages</a></li>
            <li><a href="#">Snacks</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 SpeedyFresh. All rights reserved. Built with ❤️ for fresh grocery delivery.</p>
      </div>
    </footer>
  );
}
