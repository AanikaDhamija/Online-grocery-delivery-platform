import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Package, Truck } from 'lucide-react';

// --- Inline Styles for the Component ---
const styles = {
  sidebar: {
    width: '260px',
    background: '#ffffff',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e5e7eb',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sidebarLogoIcon: {
    background: '#16a34a',
    color: '#fff',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarLogoText: {
    lineHeight: '1.2',
  },
  sidebarLogoH1: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
  },
  sidebarLogoP: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  nav: {
    padding: '1rem',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#374151',
    fontWeight: 500,
    transition: 'background-color 0.2s, color 0.2s',
  },
  navLinkActive: {
    backgroundColor: '#fefcbf', // A light yellow to match the brand
    color: '#854d0e', // Darker text for contrast
  },
};


// --- Sidebar Component ---
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/admin' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Products', icon: Package, path: '/admin/products' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={styles.sidebarLogo}>
          <div style={styles.sidebarLogoIcon}>
            <Truck size={20} />
          </div>
          <div style={styles.sidebarLogoText}>
            <h1 style={styles.sidebarLogoH1}>SpeedyFresh</h1>
            <p style={styles.sidebarLogoP}>Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li key={item.name} style={styles.navItem}>
              <Link
                to={item.path}
                style={location.pathname === item.path ? {...styles.navLink, ...styles.navLinkActive} : styles.navLink}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// --- The Main Layout Component ---
function AdminLayout() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('Admin'); // Default username
  const dropdownRef = useRef(null);

  // Get username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername"); // Also clear username on logout
    navigate("/admin/login"); // <<< CORRECTED PATH
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f9fafb" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ 
            padding: "1rem 2rem", 
            display: "flex", 
            justifyContent: "flex-end", 
            alignItems: "center",
            background: '#fff',
            borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontWeight: 500,
                fontSize: 16,
                color: "#1f2937",
                padding: "8px 12px",
                borderRadius: "999px",
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{
                background: "#e5e7eb",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 600,
                color: '#374151',
                textTransform: 'uppercase'
              }}>{username.charAt(0)}</span>
              {username}
            </button>
            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: 56,
                right: 0,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "8px",
                minWidth: 220,
                zIndex: 10,
                border: '1px solid #f3f4f6'
              }}>
                <div style={{ padding: "8px 12px", marginBottom: 8 }}>
                  <strong style={{color: '#111827', textTransform: 'capitalize'}}>{username}</strong>
                </div>
                <div style={{ borderTop: "1px solid #f3f4f6", margin: "0 -8px" }} />
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#ef4444", 
                    cursor: "pointer", 
                    padding: "10px 12px", 
                    width: "100%", 
                    textAlign: "left",
                    borderRadius: 8,
                    fontWeight: 500,
                    fontSize: 15,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "2rem", overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
