import React, { useState } from 'react';
import '../STYLES/SubscriptionFlow.css';

export default function SubscriptionConfigurator({ cartItems = [], onClose, onConfirm }) {
  const [plan, setPlan] = useState('Weekly');

  function handleConfirm() {
    const subscription = {
      id: `sub-${Date.now()}`,
      active: true,
      paused: false,
      frequency: plan,
      nextDelivery: new Date(Date.now() + (plan === 'Weekly' ? 7 : 30) * 24 * 3600 * 1000).toISOString(),
      items: (cartItems || []).map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price, image: i.image })),
    };
    if (typeof onConfirm === 'function') onConfirm(subscription);
  }

  return (
    <div className="sf-overlay compact" role="dialog" aria-modal="true">
      <div className="sf-card">
        <div className="sf-header">
          <h2>Choose a plan</h2>
          <button className="sf-close" onClick={onClose}>✕</button>
        </div>

        <div className="sf-body">
          <div className="sf-section">
            <div className="sf-plans">
              <label className={`sf-plan ${plan === 'Weekly' ? 'selected' : ''}`}>
                <input type="radio" name="plan" value="Weekly" checked={plan === 'Weekly'} onChange={() => setPlan('Weekly')} />
                <div className="sf-plan-title">Weekly</div>
                <div className="sf-plan-sub">5% Discount</div>
              </label>

              <label className={`sf-plan ${plan === 'Monthly' ? 'selected' : ''}`}>
                <input type="radio" name="plan" value="Monthly" checked={plan === 'Monthly'} onChange={() => setPlan('Monthly')} />
                <div className="sf-plan-title">Monthly</div>
                <div className="sf-plan-sub">10% Discount</div>
              </label>
            </div>

            <p className="sd-note" style={{ marginTop: 12 }}>Your cart items will be included in the subscription.</p>
          </div>
        </div>

        <div className="sf-footer">
          <button className="sf-btn sf-secondary" onClick={onClose}>Cancel</button>
          <button className="sf-btn sf-primary" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
