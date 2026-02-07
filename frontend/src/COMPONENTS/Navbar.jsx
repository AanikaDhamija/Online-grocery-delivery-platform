// --- MERGED VERSION ---
// Combines all features: responsive, payments, rewards, and auth context

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { AuthContext } from "./AuthContext"; // For user authentication
import PointsDisplay from "../loyalty/components/PointsDisplay";
import "../STYLES/Navbar.css";

export default function Navbar({ searchTerm, setSearchTerm, onCartClick }) {
  // All hooks from both branches
  const { cartItems } = useCart();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Get user and logout from context

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // All click handlers
  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => {
      const hero = document.getElementById("hero");
      if (hero) {
        const yOffset = -80;
        const y = hero.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("fresh-products");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left Section - Logo */}
        <div
          className="navbar-left"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img src="/images/logo.png" alt="SpeedyFresh Logo" className="logo-img" />
          <div className="logo-text-wrap">
            <span className="logo-text">SpeedyFresh</span>
            <small className="logo-tagline">Fresh · Fast · Reliable</small>
          </div>
        </div>

        {/* Center - Search */}
        <div className="navbar-center">
          <label className="search-wrapper" htmlFor="nav-search">
            <svg className="icon search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="#9CA3AF" strokeWidth="1.6"/>
            </svg>
            <input
              id="nav-search"
              className="search-input"
              type="search"
              placeholder="Search for fresh groceries..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </label>
        </div>

        {/* Right Section (with dynamic login/logout) */}
        <div className="navbar-right">
          {user && (
            <Link to="/my-rewards" className="login-link" title="My Rewards">
              🏅
              <PointsDisplay />
            </Link>
          )}

          {user ? (
            <div className="user-info">
              <Link to="/my-subscription" className="welcome-text" title="My Subscription">Hi, {user.name}</Link>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-link" title="Login" aria-label="Login">
              <svg className="icon user-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="login-text">Login</span>
            </Link>
          )}

          <button className="cart-button" onClick={onCartClick} aria-label="Open cart" title="Cart">
            <svg className="icon cart-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 6h15l-1.4 8.2A2 2 0 0117.7 16H9.3a2 2 0 01-1.9-1.6L6 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="1" fill="#fff" />
              <circle cx="18" cy="20" r="1" fill="#fff" />
            </svg>
            <span className="cart-text">Cart</span>
            {totalQuantity > 0 && (
              <span className="cart-badge" aria-live="polite">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
        
        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-search">
           <label className="search-wrapper" htmlFor="mobile-nav-search">
             <svg className="icon search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
               <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
               <circle cx="11" cy="11" r="6" stroke="#9CA3AF" strokeWidth="1.6"/>
             </svg>
            <input
              id="mobile-nav-search"
              className="search-input"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
          </label>
        </div>
        {user ? (
          <a href="#" onClick={() => { logout(); toggleMobileMenu(); }}>Logout</a>
        ) : (
          <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
        )}
        <a href="#" onClick={() => { onCartClick(); toggleMobileMenu(); }}>Cart</a>
      </nav>
    </header>
  );
}