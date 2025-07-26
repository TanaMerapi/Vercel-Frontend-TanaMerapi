import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './Navbar.scss';
import logoImage from '../../images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when sidebar is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Add background after scrolling 50px
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img 
              src={logoImage} 
              alt="Tanah Merapi Logo" 
              className="logo-image"
            />
          </Link>
          
          <button className="menu-button" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        </div>
        
        {/* Dark overlay for sidebar */}
        <div 
          className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} 
          onClick={closeMenu}
        ></div>
        
        <nav className={`navbar-menu ${isOpen ? 'is-active' : ''}`} ref={sidebarRef}>
          <div className="sidebar-header">
            <Link to="/" className="sidebar-logo" onClick={closeMenu}>
              <img 
                src={logoImage} 
                alt="Tanah Merapi Logo" 
                className="logo-image"
              />
            </Link>
          </div>
          
          <div className="navbar-links">
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
            <NavLink to="/packages" onClick={closeMenu}>Paket Jeep & Jeruk</NavLink>
            <NavLink to="/promotions" onClick={closeMenu}>Promo</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Kontak & Lokasi</NavLink>
          </div>
          
          <div className="sidebar-footer">
            <p>© 2025 Tanah Merapi</p>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;