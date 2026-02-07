import React from 'react';
import '../STYLES/DeliveryInfo.css';

const deliveryCities = ['Chandigarh','Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai'];

export default function DeliveryInfo() {
  return (
    <div className="delivery-info-section">
      <p className="delivery-title">Currently delivering to</p>
      <div className="city-tags">
        {deliveryCities.map(city => (
          <span key={city} className="city-tag">{city}</span>
        ))}
      </div>
    </div>
  );
}