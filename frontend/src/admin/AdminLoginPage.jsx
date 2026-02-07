import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Admin credentials (in a real app, use environment variables)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };
  
  // Inline styles for the component
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7fee7", // A very light green, matching the fresh theme
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    },
    container: {
      display: "flex",
      width: "900px",
      height: "600px",
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden", // Ensures content respects the border radius
    },
    // Left side for branding
    brandingSection: {
      flex: 1,
      background: "linear-gradient(160deg, #16a34a 0%, #4ade80 100%)",
      color: "#fff",
      padding: "4rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
    },
    logoIcon: {
        width: "40px",
        height: "40px"
    },
    brandingTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: "1rem",
    },
    brandingText: {
      fontSize: "1rem",
      color: "#d1fae5", // Lighter text color for contrast
      lineHeight: 1.6,
    },
    // Right side for the login form
    loginSection: {
      flex: 1,
      padding: "4rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    loginTitle: {
      fontSize: "2rem",
      fontWeight: 800,
      color: "#1f2937",
      marginBottom: "0.5rem",
    },
    loginSubtitle: {
      fontSize: "1rem",
      color: "#6b7280",
      marginBottom: "2.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    inputGroup: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "1rem 1rem 1rem 3rem",
      fontSize: "1rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      boxSizing: "border-box",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    inputIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3be",
    },
    button: {
      padding: "1rem",
      borderRadius: "12px",
      border: "none",
      background: "#facc15", // Yellow from the "Shop Now" button
      color: "#422006", // Darker text for readability on yellow
      fontWeight: "bold",
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "background-color 0.2s, transform 0.1s",
      marginTop: "1rem",
    },
    error: {
      color: "#ef4444",
      textAlign: "center",
      fontWeight: 500,
      marginTop: "1rem",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Left Branding Section */}
        <div style={styles.brandingSection}>
          <div style={styles.logo}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="21" r="2" fill="#FFFFFF"/>
              <circle cx="20" cy="21" r="2" fill="#FFFFFF"/>
            </svg>
            SpeedyFresh
          </div>
          <h1 style={styles.brandingTitle}>Admin Control Panel</h1>
          <p style={styles.brandingText}>
            Manage products, view orders, and oversee operations to keep SpeedyFresh running smoothly.
          </p>
        </div>

        {/* Right Login Form Section */}
        <div style={styles.loginSection}>
          <h2 style={styles.loginTitle}>Welcome Back!</h2>
          <p style={styles.loginSubtitle}>Please enter your credentials to log in.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                onFocus={e => {
                  e.target.style.borderColor = "#16a34a";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.2)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={e => {
                  e.target.style.borderColor = "#16a34a";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.2)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="submit"
              style={styles.button}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = "#fde047";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = "#facc15";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Login
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;