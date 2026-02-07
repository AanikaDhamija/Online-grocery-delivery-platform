import React from 'react';
import { usePoints } from '../context/PointsContext';

const PointsDisplay = () => {
  // This component gets the points from our context
  const { points } = usePoints(); 

  // It then displays the points in a simple span
  return (
    <span style={{ marginLeft: '4px' }}>
      {points} Points
    </span>
  );
};

export default PointsDisplay;