// FINAL frontend/src/loyalty/pages/LoyaltyDashboardPage.jsx

import React, { useState, useEffect } from 'react'; // 1. IMPORT useState and useEffect
import { usePoints } from '../context/PointsContext';
import '../../STYLES/LoyaltyDashboard.css';

const LoyaltyDashboardPage = () => {
  const { points } = usePoints();
  
  // 2. ADD state to store the history from the API
  const [history, setHistory] = useState([]);

  // 3. FETCH real history data from the backend when the page loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        if (!userId) return;
  const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/loyalty/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        setHistory(data.history); // Set the history from the response
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, []); // The empty array ensures this runs only once

  return (
    <div className="loyalty-dashboard">
      <h2>My Loyalty Rewards</h2>
      <div className="points-overview-card">
        <h3>Your Current Balance</h3>
        <span className="points-balance">🏅 {points} Points</span>
      </div>
      
      <div className="history-section">
        <h3>Transaction History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. MAP over the real 'history' state instead of mock data */}
            {history.map(item => (
              <tr key={item.historyId}>
                {/* We format the date to be more readable */}
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.reason}</td>
                <td className={item.points > 0 ? 'points-earned' : 'points-spent'}>
                  {item.points > 0 ? `+${item.points}` : item.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoyaltyDashboardPage;