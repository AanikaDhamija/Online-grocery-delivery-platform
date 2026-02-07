import React, { useState, useEffect } from 'react';
import '../STYLES/SubscriptionDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export default function CreateSubscription() {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [selectedPlan, setSelectedPlan] = useState('Weekly');
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        if (selectedPlan === 'Weekly') {
            const today = new Date();
            const nextFriday = new Date(today);
            nextFriday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
            if (nextFriday.getDate() === today.getDate()) { nextFriday.setDate(nextFriday.getDate() + 7); }
            setDeliveryDate(nextFriday);
        } else if (selectedPlan === 'Monthly') {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setDeliveryDate(nextMonth);
        }
    }, [selectedPlan]);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const calculateSubtotal = (items) => (items || []).reduce((total, item) => total + (item.price || 0) * (item.qty || 0), 0);
    const itemsToDisplay = cartItems || [];
    const subtotal = calculateSubtotal(itemsToDisplay);
    const discountPercent = selectedPlan === 'Weekly' ? 0.05 : 0.10;
    const discountAmount = subtotal * discountPercent;
    const finalTotal = subtotal - discountAmount;

    const handleCreateSubscription = async () => {
        setIsSaving(true);
    const userObj = JSON.parse(localStorage.getItem('user'));
    const userId = userObj?.id;
        if (!userId) {
            alert('You must be logged in to create a subscription.');
            setIsSaving(false);
            return;
        }
        // Ensure all items have a 'quantity' property
        const details = { items: itemsToDisplay.map(item => ({
            ...item,
            quantity: item.quantity ?? item.qty ?? 0
        })) };
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ userId, plan: selectedPlan, endDate: deliveryDate, details })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Subscription created successfully!');
            setIsSaving(false);
            navigate('/');
        } else {
            alert(result.message || 'Failed to create subscription');
            setIsSaving(false);
        }
    };

    return (
        <div className="sd-overlay sd-fullpage">
            <div className="sd-card sd-grid">
                <div className="sd-header">
                    <h2>Create Subscription</h2>
                </div>
                <div className="sd-left">
                    <section className="sd-card-inner sd-details">
                        <div className="sd-line">
                            <button className="sd-info-btn" onClick={() => setShowInfoModal(true)}>
                                What is a Subscription?<span className="info-icon">?</span>
                            </button>
                        </div>
                        <div className="sd-line">
                            <span className="sd-small">Frequency</span>
                            <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="sd-line">
                            <span className="sd-small">Delivery Starting From</span>
                            <strong>{deliveryDate ? formatDate(deliveryDate) : '...'}</strong>
                        </div>
                    </section>
                    <section className="sd-card-inner sd-items">
                        <div className="sd-items-header">
                            <h3>Items in your box</h3>
                        </div>
                        <div className="sd-list">
                            {itemsToDisplay.length === 0 ? (
                                <div className="sd-empty-copy">No items in your cart. Add items to create a subscription.</div>
                            ) : (
                                itemsToDisplay.map((item, index) => (
                                    <div className="sd-list-row" key={item.id || index}>
                                        <img className="sd-thumb" src={item.image || 'https://placehold.co/60x60'} alt={item.name} />
                                        <div className="sd-item-meta">
                                            <div className="sd-item-name">{item.name}</div>
                                            <div className="sd-item-price">₹{(item.price || 0).toFixed(2)} each</div>
                                        </div>
                                        <div className="sd-qty">
                                            <div>Qty: {item.quantity || item.qty}</div>
                                            <div className="sd-subtotal">Subtotal: ₹{((item.quantity || item.qty || 0) * (item.price || 0)).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
                <aside className="sd-right">
                    <section className="sd-card-inner sd-manage">
                        <h3>Subscription Summary</h3>
                        <div className="sd-totals">
                            <div className="sd-totals-row">
                                <span className="sd-totals-label">Subtotal</span>
                                <span className="sd-totals-value">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="sd-totals-row sd-grand-total">
                                <span className="sd-totals-label">Total</span>
                                <span className="sd-totals-value">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="sd-btn sd-primary" onClick={handleCreateSubscription} disabled={isSaving || itemsToDisplay.length === 0}>
                            {isSaving ? 'Creating...' : 'Create Subscription'}
                        </button>
                    </section>
                </aside>
            </div>
            {showInfoModal && (
                <div className="info-modal-overlay" onClick={() => setShowInfoModal(false)}>
                    <div className="info-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="info-modal-header">
                            <h2>How Subscriptions Work</h2>
                            <button className="info-modal-close" onClick={() => setShowInfoModal(false)}>✕</button>
                        </div>
                        <div className="info-modal-body">
                            <p>Set up a regular delivery of your favorite groceries and save money on every order!</p>
                            <ul>
                                <li><strong>Save Money:</strong> Get a 5% discount on weekly orders and 10% on monthly orders.</li>
                                <li><strong>Convenience:</strong> Your groceries are delivered automatically on a schedule you choose.</li>
                                <li><strong>Flexibility:</strong> Easily change the items in your box, pause, or cancel your subscription anytime.</li>
                            </ul>
                            <button className="sd-btn sd-primary" onClick={() => setShowInfoModal(false)}>Got it!</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
