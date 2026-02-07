import React, { useEffect, useState, useContext } from "react";
import "../STYLES/SubscriptionDashboard.css";
import { AuthContext } from "./AuthContext";

export default function MySubscriptionModal({ onClose, asPage = false }) {
// ...existing code...
  const { user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
  const userId = user.id;
  const token = localStorage.getItem('token');
  fetch(`${import.meta.env.VITE_API_URL}/api/subscription/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load subscription info.");
        setLoading(false);
      });
  }, [user]);

  const Container = ({ children }) => (
    asPage ? (
      <div style={{ maxWidth: 840, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>{children}</div>
    ) : (
      <div className="modal-overlay"><div className="modal-content subscription-modal">{children}</div></div>
    )
  );

  // no status/pause controls

  return (
    <Container>
        {!asPage && <button className="modal-close" onClick={onClose}>&times;</button>}
        <h2>My Subscription</h2>
        {loading && <div className="modal-loading">Loading...</div>}
        {error && <div className="modal-error">{error}</div>}
        {!loading && !error && subscriptions.length === 0 && (
          <div className="modal-empty">No active subscriptions found.</div>
        )}
        {!loading && !error && subscriptions.length > 0 && (
          <div className="subscription-list">
            {subscriptions.map((sub) => (
              <div className="subscription-card" key={sub._id}>
                <div><b>Plan:</b> {sub.plan}</div>
                <div><b>Start Date:</b> {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "-"}</div>
                <div><b>End Date:</b> {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "-"}</div>
                {sub.details && sub.details.items && (
                  <div className="subscription-details">
                    <b>Products:</b>
                    <ul style={{margin: '8px 0 0 0', padding: 0, listStyle: 'none'}}>
                      {sub.details.items.map((item, idx) => (
                        <li key={item.id || idx} style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                          {item.image && <img src={item.image} alt={item.name} style={{width:36,height:36,borderRadius:8,objectFit:'cover',border:'1px solid #eee'}} />}
                          <span style={{fontWeight:600}}>{item.name}</span>
                          <span style={{color:'#6b7280',fontSize:14}}>Qty: {item.qty ?? item.quantity ?? 0}</span>
                          <span style={{color:'#6b7280',fontSize:14}}>	{item.price} each</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </Container>
  );
}
