import React, { useEffect, useState, useRef } from 'react';
import '../STYLES/SubscriptionDashboard.css';

export default function SubscriptionDetails() {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        const userId = userObj?.id;
        if (!userId) {
            setSubscription(null);
            setIsLoading(false);
            return;
        }
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/subscription/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setSubscription(data[0]);
                } else {
                    setSubscription(null);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setSubscription(null);
                setIsLoading(false);
            });
    }, []);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const calculateSubtotal = (items) => (items || []).reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

    if (isLoading) return <div className="spinner-overlay"><div className="spinner"></div></div>;
    if (!subscription) return <div className="sd-overlay sd-fullpage"><div className="sd-card sd-empty"><div className="sd-header"><h2>Active Subscription</h2><button ref={closeButtonRef} className="sd-close">✕</button></div><div className="sd-body"><p className="sd-empty-copy">No active subscription found.</p></div></div></div>;

    const itemsToDisplay = (subscription.items || subscription.details?.items || []);
    const subtotal = calculateSubtotal(itemsToDisplay);

    return (
        <div className="sd-overlay sd-fullpage">
            <div className="sd-card sd-grid">
                <div className="sd-header"><h2>Active Subscription</h2><button ref={closeButtonRef} className="sd-close">✕</button></div>
                <div className="sd-left">
                    <section className="sd-card-inner sd-details">
                        <div className="sd-line"><span className="sd-small">Frequency</span><strong>{subscription.plan || subscription.frequency}</strong></div>
                        <div className="sd-line"><span className="sd-small">Delivery Starting From</span><strong>{subscription.startDate ? formatDate(subscription.startDate) : '...'}</strong></div>
                    </section>
                    <section className="sd-card-inner sd-items">
                        <div className="sd-items-header">
                            <h3>Items in your box</h3>
                        </div>
                        <div className="sd-list">
                            {itemsToDisplay.map((item, index) => (
                                <div className="sd-list-row" key={item.id || index}>
                                    <img className="sd-thumb" src={item.image || 'https://placehold.co/60x60'} alt={item.name} />
                                    <div className="sd-item-meta">
                                        <div className="sd-item-name">{item.name}</div>
                                        <div className="sd-item-price">₹{(item.price || 0).toFixed(2)} each</div>
                                    </div>
                                    <div className="sd-qty">
                                        <div>Qty: {item.quantity || 0}</div>
                                        <div className="sd-subtotal">Subtotal: ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <aside className="sd-right">
                    <section className="sd-card-inner sd-manage">
                        <h3>Subscription Details</h3>
                        <div className="sd-totals">
                            <div className="sd-totals-row"><span className="sd-totals-label">Subtotal</span><span className="sd-totals-value">₹{subtotal.toFixed(2)}</span></div>
                            <div className="sd-totals-row sd-grand-total"><span className="sd-totals-label">Total</span><span className="sd-totals-value">₹{subtotal.toFixed(2)}</span></div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
