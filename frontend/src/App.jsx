// --- FINAL MERGED App.jsx ---
// Combines all features: Auth, Payments, Loyalty, Admin, etc.

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { CartProvider, useCart } from "./COMPONENTS/CartContext";
import { PointsProvider } from "./loyalty/context/PointsContext";
import { AuthProvider } from "./COMPONENTS/AuthContext"; // For user authentication

// --- Component Imports (Combined) ---
import Navbar from "./COMPONENTS/Navbar";
import HeroSection from "./COMPONENTS/HeroSection.jsx";
import Offers from "./COMPONENTS/Offers.jsx";
import ShopByCategory from "./COMPONENTS/ShopByCategory.jsx";
import FreshProducts from "./COMPONENTS/FreshProducts.jsx";
import Footer from "./COMPONENTS/Footer.jsx";
import LoginPage from "./COMPONENTS/LoginPage";
import SignupPage from "./COMPONENTS/SignupPage";
import SubscriptionDashboard from "./COMPONENTS/SubscriptionDashboard";
import MySubscriptionModal from "./COMPONENTS/MySubscriptionModal";
import CartSidebar from "./COMPONENTS/CartSidebar";
import AddressSidebar from "./COMPONENTS/AddressSidebar";
import AddressModal from "./COMPONENTS/AddressModal";
import LoyaltyDashboardPage from "./loyalty/pages/LoyaltyDashboardPage";
import PaymentPage from "./COMPONENTS/PaymentPage"; // From dev branch
import UserProtectedRoute from "./COMPONENTS/UserProtectedRoute";
import ProtectedRoute from "./COMPONENTS/ProtectedRoute"; // From login branch

// --- Admin Component Imports (Combined) ---
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import OrdersPage from "./admin/OrdersPage";
import ProductsPage from "./admin/ProductsPage";
import AdminLoginPage from "./admin/AdminLoginPage";


const HomePage = ({ searchTerm, selectedCategory, setSelectedCategory, setSearchTerm }) => (
  <>
    <HeroSection />
    <Offers />
    <ShopByCategory onCategorySelect={(category) => {
      setSelectedCategory(category);
      setSearchTerm(""); // Clear search when category changes
    }} />
    <FreshProducts searchTerm={searchTerm} selectedCategory={selectedCategory} />
    <Footer />
  </>
);

function AppContent() {
  const { isCartOpen, openCart, closeCart } = useCart();
  const [isAddressSidebarOpen, setAddressSidebarOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  
  // State for search and category lives here
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCheckout = () => {
    closeCart();
    setAddressSidebarOpen(true);
  };

  const handleSaveAddressSuccess = () => {
    setAddressModalOpen(false);
  };

  return (
    <>
      <Navbar
        onCartClick={openCart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Routes>
        {/* --- User-Facing Routes --- */}
        <Route
          path="/"
          element={<HomePage
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSearchTerm={setSearchTerm}
          />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/subscription" element={<SubscriptionDashboard />} />
  <Route path="/my-subscription" element={<MySubscriptionModal asPage={true} />} />
        <Route path="/my-rewards" element={<LoyaltyDashboardPage />} />
        <Route path="/payment" element={
          <UserProtectedRoute>
            <PaymentPage />
          </UserProtectedRoute>
        } />
        <Route path="/order-success" element={
          <div style={{textAlign: 'center', padding: '4rem'}}>
            <h1>✅ Payment Successful!</h1>
            <p>Your order has been placed.</p>
          </div>
        } />
        
        {/* --- Admin Routes --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested admin routes render inside AdminLayout's <Outlet> */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
      
      {isCartOpen && <CartSidebar onClose={closeCart} onCheckout={handleCheckout} />}
      
      {isAddressSidebarOpen && (
        <AddressSidebar
          onClose={() => setAddressSidebarOpen(false)}
          onAddNewAddress={() => {
            setAddressSidebarOpen(false);
            setAddressModalOpen(true);
          }}
        />
      )}

      {isAddressModalOpen && (
        <AddressModal
          apiKey={import.meta.env.VITE_MAPS_API_KEY}
          onClose={() => setAddressModalOpen(false)}
          onSaveSuccess={handleSaveAddressSuccess}
        />
      )}
    </>
  );
}

function App() {
  return (
    // Wrap everything in the AuthProvider so all components can access user state
    <AuthProvider>
      <PointsProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </PointsProvider>
    </AuthProvider>
  );
}

export default App;