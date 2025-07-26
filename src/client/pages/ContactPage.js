import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import './ContactPage.scss';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import { MapPin, Phone, Mail, Menu } from 'lucide-react';
import logoImage from '../../images/logo.png';

const ContactPage = () => {
  const socialMedia = useOutletContext();
  
  // Navbar states - copied from HomePage
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  // Navbar functions - copied from HomePage
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Scroll prevention is now handled by CSS with the is-sidebar-open class
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    // Scroll prevention is now handled by CSS with the is-sidebar-open class
  };
  
  // Helper function to get display text for a social media platform
  const getSocialMediaDisplay = (platform, url) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        // Extract handle from URL (e.g., https://instagram.com/tana_merapi → @tana_merapi)
        const igMatch = url.match(/instagram\.com\/([^\/\?]+)/);
        return igMatch ? `@${igMatch[1]}` : url;
      case 'tiktok':
        // Extract handle from URL (e.g., https://tiktok.com/@tanamerapimovement → @tanamerapimovement)
        const ttMatch = url.match(/tiktok\.com\/@?([^\/\?]+)/);
        return ttMatch ? `@${ttMatch[1]}` : url;
      case 'whatsapp':
        // Extract phone from URL (e.g., https://wa.me/6285713555331 → +62 857-1355-5331)
        const waMatch = url.match(/wa\.me\/(\d+)/);
        if (waMatch) {
          const phone = waMatch[1];
          // Format phone number with country code
          if (phone.startsWith('62')) {
            return `+${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 9)}-${phone.slice(9)}`;
          }
          return `+${phone}`;
        }
        return url;
      default:
        return url;
    }
  };
  
  // Get featured social media platforms - copied from HomePage
  const getFeaturedSocialMedia = () => {
    return socialMedia ? socialMedia.filter(sm => 
      ['instagram', 'tiktok', 'whatsapp'].includes(sm.platform.toLowerCase())
    ) : [];
  };
  
  // Handle scroll effect for navbar - copied from HomePage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Add background after scrolling 50px
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close sidebar when clicking outside - copied from HomePage
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
    <div className={`contact-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar contact-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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

      {/* Enhanced Header Section */}
      <section className="contact-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Mail size={52} className="title-icon" />
              <div>
                <h1>Hubungi Kami</h1>
                <p>Kami siap membantu Anda dengan informasi dan layanan terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-cards">
            {socialMedia.map((social) => (
              <div key={social.id} className="contact-card">
                <div className="icon-container">
                  <SocialMediaIcon
                    platform={social.platform}
                    url={social.url}
                  />
                </div>
                <div className="contact-info">
                  <h3>{social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}</h3>
                  <p>{getSocialMediaDisplay(social.platform, social.url)}</p>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="contact-button">
                    Hubungi
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="map-section">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2784519032593!2d110.4634356!3d-7.600934399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a670046094faf%3A0x530487b6ab12895c!2sAgrowisata%20Petik%20Jeruk!5e1!3m2!1sen!2sid!4v1752397056703!5m2!1sen!2sid" 
          width="100%" 
          height="500" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Agrowisata Petik Jeruk Location"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactPage;