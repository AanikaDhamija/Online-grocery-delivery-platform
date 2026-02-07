// src/COMPONENTS/SubscriptionDashboard.jsx
import React, { useEffect, useState, useRef, useContext } from 'react';
import '../STYLES/SubscriptionDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { AuthContext } from './AuthContext';

const LoadingSpinner = () => ( <div className="spinner-overlay"><div className="spinner"></div></div> );
const SubscriptionInfoModal = ({ onClose }) => ( <div className="info-modal-overlay" onClick={onClose}><div className="info-modal-card" onClick={(e) => e.stopPropagation()}><div className="info-modal-header"><h2>How Subscriptions Work</h2><button className="info-modal-close" onClick={onClose}>✕</button></div><div className="info-modal-body"><p>Set up a regular delivery of your favorite groceries and save money on every order!</p><ul><li><strong>Save Money:</strong> Get a 5% discount on weekly orders and 10% on monthly orders.</li><li><strong>Convenience:</strong> Your groceries are delivered automatically on a schedule you choose.</li><li><strong>Flexibility:</strong> Easily change the items in your box, pause, or cancel your subscription anytime.</li></ul><button className="sd-btn sd-primary" onClick={onClose}>Got it!</button></div></div></div> );

export default function SubscriptionDashboard({ fullPage = true }) {
    const navigate = useNavigate();
    const { cartItems, showMainLoader, removeItem, clearCart } = useCart();
    const { user, isLoggedIn } = useContext(AuthContext);
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const [subscription, setSubscription] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState([]);
    const closeButtonRef = useRef(null);
    const [selectedPlan, setSelectedPlan] = useState('Weekly');
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            if (cartItems && cartItems.length > 0) {
                const newSubFromCart = {
                    id: `new-sub-${Date.now()}`,
                    active: true,
                    frequency: 'Weekly',
                    items: cartItems.map(item => ({ id: item.id, name: item.name, qty: item.quantity, price: item.price, image: item.image, })),
                };
                setSubscription(newSubFromCart);
            } else {
                setSubscription(null);
            }
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [cartItems]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        if (closeButtonRef.current) closeButtonRef.current.focus();
        return () => { document.body.style.overflow = previousOverflow; };
    }, []);

    const handleClose = () => navigate('/');
    const handleAddItems = () => navigate('/#shop-by-category-section');
    
    // Create subscription in backend (MongoDB)
    const handleCreateSubscription = async () => {
        try {
            if (!isLoggedIn || !user?.id) {
                // Redirect to login if not authenticated
                navigate('/login');
                return;
            }

            const items = (subscription?.items || []).map((it) => ({
                id: it.id,
                name: it.name,
                price: Number(it.price || 0),
                quantity: Number(it.qty || it.quantity || 0),
                image: it.image,
            }));

            if (!items.length) {
                alert('Your subscription has no items. Please add items first.');
                return;
            }

            // Optional loader if present in context
            if (typeof showMainLoader === 'function') {
                showMainLoader();
            }

            const payload = {
                userId: user.id,
                plan: selectedPlan,
                startDate: deliveryDate ? new Date(deliveryDate).toISOString() : new Date().toISOString(),
                details: { items },
            };

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error('Failed to create subscription:', data);
                alert(data?.message || 'Failed to create subscription');
                return;
            }

            // Success: clear cart and navigate home
            if (typeof clearCart === 'function') {
                clearCart();
            }
            alert('Subscription created successfully!');
            navigate('/');
        } catch (err) {
            console.error('Create subscription error:', err);
            alert('Something went wrong while creating the subscription.');
        }
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setSubscription({ ...subscription, items: editedItems, frequency: selectedPlan });
            setIsSaving(false);
            setIsEditing(false);
        }, 1000);
    };
    const handleToggleEditMode = (isEditingNow) => {
        setIsEditing(isEditingNow);
        if (isEditingNow && subscription) { setEditedItems(JSON.parse(JSON.stringify(subscription.items || []))); }
    };
    const handleQuantityChange = (itemIndex, newQty) => {
        const updatedQty = Math.max(0, parseInt(newQty, 10)) || 0;
        if (updatedQty === 0) {
            const itemToRemove = editedItems[itemIndex];
            if (itemToRemove) {
                removeItem(itemToRemove.id);
            }
            setEditedItems(currentItems => currentItems.filter((_, index) => index !== itemIndex));
        } else {
            setEditedItems(currentItems => currentItems.map((item, index) =>
                index === itemIndex ? { ...item, qty: updatedQty } : item
            ));
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const calculateSubtotal = (items) => (items || []).reduce((total, item) => total + (item.price || 0) * (item.qty || 0), 0);
    
    if (isLoading) { return <LoadingSpinner />; }
    if (!subscription) { return ( <div className="sd-overlay sd-fullpage"><div className="sd-card sd-empty"><div className="sd-header"><h2>My Subscription</h2><button ref={closeButtonRef} className="sd-close" onClick={handleClose}>✕</button></div><div className="sd-body"><p className="sd-empty-copy">Add items to your cart to create a subscription.</p><div className="sd-empty-actions"><button className="sd-btn sd-primary" onClick={handleClose}>Start Shopping</button></div></div></div></div> ); }

    const itemsToDisplay = isEditing ? editedItems : (subscription.items || []);
    const subtotal = calculateSubtotal(itemsToDisplay);
    const discountPercent = selectedPlan === 'Weekly' ? 0.05 : 0.10;
    const discountAmount = subtotal * discountPercent;
    const finalTotal = subtotal - discountAmount;

    return (
        <>
            {showInfoModal && <SubscriptionInfoModal onClose={() => setShowInfoModal(false)} />}
            <div className="sd-overlay sd-fullpage">
                <div className="sd-card sd-grid">
                    <div className="sd-header"><h2>My Subscription</h2><button ref={closeButtonRef} className="sd-close" onClick={handleClose}>✕</button></div>
                    <div className="sd-left">
                        <section className="sd-card-inner sd-details">
                            <div className="sd-line"><button className="sd-info-btn" onClick={() => setShowInfoModal(true)}>What is a Subscription?<span className="info-icon">?</span></button></div>
                            <div className="sd-line"><span className="sd-small">Frequency</span><strong>{selectedPlan}</strong></div>
                            <div className="sd-line"><span className="sd-small">Delivery Starting From</span><strong>{deliveryDate ? formatDate(deliveryDate) : '...'}</strong></div>
                        </section>
                        <section className="sd-card-inner sd-items">
                            <div className="sd-items-header">
                                <h3>Items in your box</h3>
                                <div className="sd-actions-inline">{!isEditing ? (<><button className="sd-btn sd-small sd-secondary" onClick={handleAddItems}>+ Add Items</button><button className="sd-btn sd-small sd-secondary" onClick={() => handleToggleEditMode(true)}>Change Items</button></>) : (isSaving ? (<div className="small-spinner"></div>) : (<><button className="sd-btn sd-small sd-primary" onClick={handleSaveChanges}>Save Changes</button><button className="sd-btn sd-small sd-secondary" onClick={() => handleToggleEditMode(false)}>Cancel</button></>))}</div>
                            </div>
                            <div className="sd-list">{itemsToDisplay.map((item, index) => (<div className="sd-list-row" key={item.id || index}><img className="sd-thumb" src={item.image || 'https://placehold.co/60x60'} alt={item.name} /><div className="sd-item-meta"><div className="sd-item-name">{item.name}</div><div className="sd-item-price">₹{(item.price || 0).toFixed(2)} each</div></div><div className="sd-qty">{isEditing ? (<div className="sd-qty-controls"><button onClick={() => handleQuantityChange(index, item.qty - 1)}>−</button><input value={item.qty} onChange={(e) => handleQuantityChange(index, e.target.value)} /><button onClick={() => handleQuantityChange(index, item.qty + 1)}>+</button></div>) : (<div>Qty: {item.qty}</div>)}<div className="sd-subtotal">Subtotal: ₹{((item.qty || 0) * (item.price || 0)).toFixed(2)}</div></div></div>))}</div>
                        </section>
                    </div>
                    <aside className="sd-right">
                        <section className="sd-card-inner sd-manage">
                            <h3>Choose a plan</h3>
                            <div className="plan-selector"><div className={`plan-option ${selectedPlan === 'Weekly' ? 'selected' : ''}`} onClick={() => setSelectedPlan('Weekly')}><span className="plan-radio"></span><div className="plan-details"><strong>Weekly</strong><span>5% Discount</span></div></div><div className={`plan-option ${selectedPlan === 'Monthly' ? 'selected' : ''}`} onClick={() => setSelectedPlan('Monthly')}><span className="plan-radio"></span><div className="plan-details"><strong>Monthly</strong><span>10% Discount</span></div></div></div>
                            <p className="sd-note">Select a frequency to see your savings.</p>
                            <div className="sd-promo-plan"><span className="sd-promo-icon">🗓️</span><span><strong>{selectedPlan} Plan:</strong> Get {selectedPlan === 'Weekly' ? '5%' : '10%'} off. Free delivery on orders over ₹499.</span></div>
                            <div className="sd-totals">
                                <div className="sd-totals-row"><span className="sd-totals-label">Subtotal</span><span className="sd-totals-value">₹{subtotal.toFixed(2)}</span></div>
                                <div className="sd-totals-row sd-savings"><span className="sd-totals-label">Discount ({selectedPlan === 'Weekly' ? '5%' : '10%'})</span><span className="sd-totals-value">- ₹{discountAmount.toFixed(2)}</span></div>
                                <div className="sd-totals-row sd-grand-total"><span className="sd-totals-label">Total</span><span className="sd-totals-value">₹{finalTotal.toFixed(2)}</span></div>
                            </div>
                            <div className="sd-manage-footer">{!isEditing && (<button className="sd-btn sd-primary" onClick={handleCreateSubscription}>+ Create Subscription</button>)}</div>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}