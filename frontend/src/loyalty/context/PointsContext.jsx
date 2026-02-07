// FINAL frontend/src/loyalty/context/PointsContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const PointsContext = createContext();
export const usePoints = () => useContext(PointsContext);

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [tier, setTier] = useState('Bronze'); // 1. ADD state for the tier

  const fetchPoints = async () => {
    try {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id || user?._id; // fallback to _id
  if (!userId) return;
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/loyalty/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setPoints(data.balance);
      setTier(data.tier); // 2. SET the tier from the API response
    } catch (error) {
      console.error("Failed to fetch points:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const value = { 
    points, 
    setPoints, // expose setter for immediate updates
    pointsDiscount, 
    setPointsDiscount,
    fetchPoints,
    tier // export tier
  };

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};