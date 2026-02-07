import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../STYLES/PaymentPage.css';
import { usePoints } from '../loyalty/context/PointsContext';


export default function PaymentPage() {
    const { clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { fetchPoints, setPoints } = usePoints();

    // Promo code related state
    const [promoCode, setPromoCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [eligibleUsesLeft, setEligibleUsesLeft] = useState(0);
    const [showPromoInput, setShowPromoInput] = useState(false); // initially hide input

    // Get the amount and selected address passed from the previous page
    const { amount, address } = location.state || { amount: 0, address: null };

    // Determine payable amount after discount
    const payableAmount = Math.max(0, amount - discountAmount);

    useEffect(() => {
        if (!address || amount <= 0) {
            // If there's no address or amount, redirect back to the cart or home
            navigate('/');
        }
    }, [address, amount, navigate]);

    useEffect(() => {
        // Load usage count for promo per user from localStorage
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id || user?._id; // handle different id keys
            if (userId) {
                const usedCount = Number(localStorage.getItem(`promoUsage_FRESH20_${userId}`) || 0);
                setEligibleUsesLeft(Math.max(0, 3 - usedCount));
            }
        } catch (e) {
            // Fail silently; promo just won't be shown as eligible
        }
    }, []);

    const applyPromo = () => {
        const code = promoCode.trim().toUpperCase();
        if (!code) return;
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?._id;
        const usedCount = Number(localStorage.getItem(`promoUsage_FRESH20_${userId}`) || 0);

        if (code !== 'FRESH20') {
            setPromoMessage('Invalid promo code.');
            setPromoApplied(false);
            setDiscountAmount(0);
            return;
        }
        if (usedCount >= 3) {
            setPromoMessage('Promo code already used for 3 orders.');
            setPromoApplied(false);
            setDiscountAmount(0);
            return;
        }
        // Apply 20% discount
        const discount = amount * 0.20;
        setDiscountAmount(discount);
        setPromoApplied(true);
        setPromoMessage(`FRESH20 applied! You saved ₹${discount.toFixed(2)}.`);
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;
            const token = localStorage.getItem('token');
            if (userId && token) {
                // Send original order amount for loyalty points base, not discounted payable
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ userId, totalAmount: amount, pointsRedeemed: 0 })
                });
                // After successful order creation, update loyalty balance immediately
                if (res.ok) {
                    const data = await res.json();
                    if (data.balance !== undefined) {
                        setPoints(data.balance); // immediate update
                    } else {
                        await fetchPoints(); // fallback
                    }
                }
                // Increment promo usage if applied
                if (promoApplied) {
                    const key = `promoUsage_FRESH20_${userId}`;
                    const current = Number(localStorage.getItem(key) || 0);
                    localStorage.setItem(key, String(current + 1));
                }
            }
            clearCart();
            alert('Payment successful!');
            navigate('/');
        } catch (e) {
            console.error('Payment error:', e);
            alert('Payment failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!address) return null; // Render nothing if redirected without state

    return (
        <div className="payment-page-container">
            <div className="payment-card">
                <h2>Confirm Your Order</h2>

                <div className="payment-details">
                    <div className="detail-row">
                        <span>Delivering to:</span>
                        <strong>{address.label}</strong>
                    </div>
                    <p className="address-summary">{address.flat}, {address.area}, {address.city}</p>
                    
                    <div className="detail-row amount-row">
                        <span>Amount to Pay:</span>
                        <strong>₹{amount.toFixed(2)}</strong>
                    </div>

                                        {/* Promo Code Section (lazy reveal) */}
                                        <div className="promo-section">
                                                {!showPromoInput && !promoApplied && (
                                                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                                                        <div style={{ fontSize:'14px', color:'#333' }}>
                                                            Get <strong>20% off</strong> on your first 3 orders using <strong>FRESH20</strong>.
                                                            {eligibleUsesLeft > 0 && (
                                                                <span style={{ marginLeft:'4px', color:'#555' }}>
                                                                    ({eligibleUsesLeft} use{eligibleUsesLeft===1?'':'s'} left)
                                                                </span>
                                                            )}
                                                        </div>
                                                        {eligibleUsesLeft > 0 ? (
                                                            <button type="button" className="apply-promo-button" onClick={() => setShowPromoInput(true)}>
                                                                Use Promo
                                                            </button>
                                                        ) : (
                                                            <small style={{ color:'#888' }}>Promo exhausted.</small>
                                                        )}
                                                    </div>
                                                )}
                                                { (showPromoInput || promoApplied) && (
                                                    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                                                        <label htmlFor="promoInput" style={{ fontWeight:500 }}>Promo Code</label>
                                                        <div style={{ display:'flex', gap:'8px' }}>
                                                            <input
                                                                id="promoInput"
                                                                type="text"
                                                                placeholder={eligibleUsesLeft > 0 ? 'Enter code (e.g. FRESH20)' : 'No promo eligible'}
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value)}
                                                                disabled={eligibleUsesLeft === 0 || promoApplied}
                                                                style={{ flex:1 }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={applyPromo}
                                                                disabled={eligibleUsesLeft === 0 || promoApplied || !promoCode.trim()}
                                                                className="apply-promo-button"
                                                            >
                                                                {promoApplied ? 'Applied' : 'Apply'}
                                                            </button>
                                                        </div>
                                                        {eligibleUsesLeft > 0 && !promoApplied && (
                                                            <small style={{ color:'#555' }}>You can use FRESH20 for {eligibleUsesLeft} more order{eligibleUsesLeft===1?'':'s'}.</small>
                                                        )}
                                                        {promoMessage && (
                                                            <div style={{ marginTop:'4px', color: promoApplied ? 'green' : 'crimson' }}>{promoMessage}</div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                    {promoApplied && (
                        <div className="detail-row" style={{ marginTop: '10px' }}>
                            <span style={{ color: 'green' }}>Promo Discount (20%):</span>
                            <strong style={{ color: 'green' }}>-₹{discountAmount.toFixed(2)}</strong>
                        </div>
                    )}

                    {promoApplied && (
                        <div className="detail-row amount-row" style={{ marginTop: '4px' }}>
                            <span>New Payable Amount:</span>
                            <strong>₹{payableAmount.toFixed(2)}</strong>
                        </div>
                    )}
                </div>

                <button onClick={handlePayment} className="pay-now-button" disabled={loading}>
                    {loading ? 'Processing...' : `Pay ₹${(promoApplied ? payableAmount : amount).toFixed(2)}`}
                </button>
            </div>
        </div>
    );
}