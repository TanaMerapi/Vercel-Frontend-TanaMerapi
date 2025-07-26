import React, { useState, useEffect } from 'react';
import './Message.scss';
import { X } from 'lucide-react';

const Message = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (!onClose) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [onClose]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  if (!visible) return null;
  
  return (
    <div className={`message-container ${type}`}>
      <p>{message}</p>
      <button className="close-button" onClick={handleClose}>
        <X size={20} />
      </button>
    </div>
  );
};

export default Message;