import React, { useState, useRef, useEffect } from 'react';
import './ActionMenu.scss';
import { MoreVertical, Edit, Trash, Eye } from 'lucide-react';

const ActionMenu = ({ 
  onView, 
  onEdit, 
  onDelete,
  viewText = 'Lihat',
  editText = 'Edit',
  deleteText = 'Hapus'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="action-menu" ref={menuRef}>
      <button className="menu-button" onClick={toggleMenu}>
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <div className="menu-dropdown">
          {onView && (
            <button 
              className="menu-item view" 
              onClick={() => handleAction(onView)}
            >
              <Eye size={16} />
              <span>{viewText}</span>
            </button>
          )}
          
          {onEdit && (
            <button 
              className="menu-item edit" 
              onClick={() => handleAction(onEdit)}
            >
              <Edit size={16} />
              <span>{editText}</span>
            </button>
          )}
          
          {onDelete && (
            <button 
              className="menu-item delete" 
              onClick={() => handleAction(onDelete)}
            >
              <Trash size={16} />
              <span>{deleteText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;