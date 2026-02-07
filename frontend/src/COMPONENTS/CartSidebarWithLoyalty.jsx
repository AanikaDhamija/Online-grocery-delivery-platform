// FINAL frontend/src/COMPONENTS/CartSidebarWithLoyalty.jsx

import React, { useState } from 'react';
import { usePoints } from '../loyalty/context/PointsContext';
import { useCart } from './CartContext';
import OriginalCartSidebar from './CartSidebar';

const CartSidebarWithLoyalty = ({ onClose }) => {
  // 1. GET the new 'tier' from the context
  const { points, pointsDiscount, setPointsDiscount, redeemPoints, tier } = usePoints();
  
  const { cartItems } = useCart(); 
  
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  const [pointsToUse, setPointsToUse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ... (your existing calculation logic) ...
  const itemsTotal = safeCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharge = 25;
  const handlingCharge = 2;
  const originalGrandTotal = itemsTotal + deliveryCharge + handlingCharge;
  const finalTotal = originalGrandTotal - pointsDiscount;
  
  const handleApplyPoints = () => {
    // ... (your existing handleApplyPoints logic) ...
  };

  return (
    <div>
      <OriginalCartSidebar onClose={onClose} />

      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #e0e0e0', fontFamily: 'sans-serif' }}>
        
        {/* 2. ADD a conditional banner based on the user's tier */}
        {tier === 'Silver' && (
          <div style={{ padding: '10px', margin: '15px 0', background: '#c8e6c9', borderRadius: '4px', textAlign: 'center', color: '#2e7d32', fontWeight: 'bold' }}>
            🎉 Silver Member Offer: Free Delivery! 🎉
          </div>
        )}
        {tier === 'Gold' && (
          <div style={{ padding: '10px', margin: '15px 0', background: '#fff9c4', borderRadius: '4px', textAlign: 'center', color: '#f57f17', fontWeight: 'bold' }}>
            🌟 Gold Member: Free Delivery + 5% Off Veggies! 🌟
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h4>🎁 Redeem Your Loyalty Points</h4>
          {/* ... (rest of your existing redemption JSX) ... */}
        </div>
      </div>
    </div>
  );
};

export default CartSidebarWithLoyalty;