import React, { useEffect } from 'react';
import "./LevelUpPopup.css";

const LevelUpPopup = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1700);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="level-up-popup">
      <div className="level-up-popup-content">
        <h2>Congratulations!</h2>
        <p>You've leveled up!</p>
      </div>
    </div>
  );
};

export default LevelUpPopup;
