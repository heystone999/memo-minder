import React, { useState, useEffect } from 'react';
import "./Popup.css";

const Popup = ({ show, onClose, message }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{message.title}</h2>
        <p>{message.body}</p>
      </div>
    </div>
  );
};

export default Popup;
