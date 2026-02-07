import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import '../STYLES/AddressSidebar.css';

const AddressIcon = ({ label }) => {
    const icons = { Home: "🏠", Work: "💼", Hotel: "🏨", Other: "📍" };
    return <span className="address-icon">{icons[label] || "📍"}</span>;
};

export default function AddressSidebar({ onClose, onAddNewAddress }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { finalGrandTotal } = useCart();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.id;
                if (!userId) { setAddresses([]); return; }
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses`, { params: { userId }, headers: { Authorization: `Bearer ${token}` } });
                setAddresses(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch addresses. Please ensure the backend server is running.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleSelectAddress = (address) => {
        onClose(); // Close the sidebar
        navigate('/payment', { state: { amount: finalGrandTotal, address: address } });
    };

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose}></div>
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2>My Addresses</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                <div className="sidebar-body">
                    <button className="add-new-button" onClick={onAddNewAddress}>
                        + Add a new address
                    </button>
                    {loading && <p>Loading addresses...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && (
                        <div className="address-list">
                            {addresses.length === 0 ? (
                                <p>You have no saved addresses.</p>
                            ) : (
                                addresses.map(addr => (
                                    <div key={addr.id} className="address-card" onClick={() => handleSelectAddress(addr)}>
                                        <AddressIcon label={addr.label} />
                                        <div className="address-details">
                                            <strong>{addr.label}</strong>
                                            <p>{addr.flat}, {addr.area}</p>
                                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p>Contact: {addr.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}