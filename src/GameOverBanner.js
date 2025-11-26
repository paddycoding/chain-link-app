import React, { useState, useEffect } from 'react';
import './GameOverBanner.css'; // We'll create this file next

const GameOverBanner = ({ title, children }) => {
  // State to control if the banner is visible
  const [isVisible, setIsVisible] = useState(false); 
  // State to control the "roll up" animation (used for CSS class)
  const [isClosing, setIsClosing] = useState(false); 

  useEffect(() => {
    // 1. Show the banner after the component mounts
    // Using setTimeout prevents the animation from running immediately on mount, 
    // ensuring the "roll-up" effect is visible.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); 

    return () => clearTimeout(timer); // Cleanup
  }, []);

  const handleClose = () => {
    // 2. Start the "closing" animation
    setIsClosing(true); 

    // 3. Hide the component completely after the animation finishes (300ms)
    setTimeout(() => {
      setIsVisible(false);
    }, 300); 
  };

  // If the component is not supposed to be visible, return null (nothing rendered)
  if (!isVisible && !isClosing) {
    return null;
  }

  return (
    <div className={`game-over-banner ${isClosing ? 'rolling-up' : 'open'}`}>
      <div className="banner-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default GameOverBanner;