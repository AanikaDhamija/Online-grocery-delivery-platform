import React, { useContext } from "react";
import { useCart } from "./CartContext";
import { usePoints } from "../loyalty/context/PointsContext";
import "../STYLES/CartSidebar.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

// Step 1: Accept `onCheckout` as a prop here
export default function CartSidebar({ onClose, onCheckout }) {
  const { cartItems, totalPrice, increment, decrement } = useCart();
  const { pointsDiscount } = usePoints();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  // Calculations
  const deliveryCharge = totalPrice > 200 ? 0 : 25;
  const handlingCharge = 2;
  const grandTotalBeforeDiscount = totalPrice + handlingCharge + deliveryCharge;
  const finalGrandTotal = grandTotalBeforeDiscount - pointsDiscount;

  const handleCheckoutClick = () => {
    if (isLoggedIn) {
      onCheckout();
    } else {
      onClose();
      navigate('/login', { state: { fromCheckout: true } });
    }
  };

  const handleSubscribeClick = () => {
    navigate('/subscription');
    onClose();
  };

  return (
    <>
      <div className="cart-overlay show" onClick={onClose} />
      <aside className="cart-drawer open" aria-hidden={false}>
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        {/* The rest of your JSX remains exactly the same... */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div className="cart-line" key={item.id}>
                <img
                  className="cart-line-thumb"
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/60x60";
                  }}
                />
                <div className="cart-line-info">
                  <div className="cart-line-name">{item.name}</div>
                  <div className="cart-line-meta">₹{item.price}</div>
                  <div className="cart-line-qty">
                    <button onClick={() => decrement(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increment(item.id, item)}>+</button>
                  </div>
                </div>
                <div className="cart-line-subtotal">₹{item.price * item.quantity}</div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bill-details">
            <h4>Bill Details</h4>
            <div className="bill-line">
              <span>Items total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="bill-line delivery-charge">
              <span>Delivery charge</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="bill-line">
              <span>Handling charge</span>
              <span>₹{handlingCharge}</span>
            </div>

            {pointsDiscount > 0 && (
              <div className="bill-line" style={{ color: 'green' }}>
                <span>Loyalty Discount</span>
                <span>- ₹{pointsDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="bill-line total">
              <strong>Grand total</strong>
              <strong>₹{finalGrandTotal.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div className="cart-drawer-footer">
          <p className="cancellation-policy">
            <strong>Cancellation Policy</strong><br />
            Orders cannot be cancelled once packed for delivery.
          </p>
          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={handleCheckoutClick}
          >
            Checkout
          </button>
          <button
            className="subscribe-btn"
            disabled={cartItems.length === 0}
            onClick={handleSubscribeClick}
          >
            📅 Subscribe & Save
          </button>
        </div>
      </aside>
    </>
  );
}

//2