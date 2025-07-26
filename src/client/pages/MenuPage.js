import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import './MenuPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import { Coffee, Search, Utensils, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import logoImage from '../../images/logo.png';

const MenuPage = () => {
  const socialMedia = useOutletContext();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Helper function to get display text for a social media platform - copied from HomePage
  const getSocialMediaDisplay = (platform, url) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        const igMatch = url.match(/instagram\.com\/([^\/\?]+)/);
        return igMatch ? `@${igMatch[1]}` : url;
      case 'tiktok':
        const ttMatch = url.match(/tiktok\.com\/@?([^\/\?]+)/);
        return ttMatch ? `@${ttMatch[1]}` : url;
      case 'whatsapp':
        const waMatch = url.match(/wa\.me\/(\d+)/);
        if (waMatch) {
          const phone = waMatch[1];
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
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menu-items');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
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
  
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className={`menu-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar menu-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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
      <section className="menu-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Utensils size={62} className="title-icon" />
              <div>
                <h1>Menu Kedai Tanah Merapi</h1>
                <p>Nikmati hidangan kami dengan suasana alam yang menyegarkan</p>
              </div>
            </div>
            
            <div className="search-container">
              <div className="search-input">
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="Cari menu..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Menu Section */}
      <section className="section menu-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : filteredMenuItems.length > 0 ? (
            <div className="menu-grid">
              {filteredMenuItems.map((menuItem) => (
                <div key={menuItem.id} className="menu-card">
                  <div className="menu-image">
                    <img 
                      src={getImageUrl(menuItem.image_url)} 
                      alt={menuItem.name}
                    />
                  </div>
                  <div className="menu-info">
                    <h3>{menuItem.name}</h3>
                    <p>{menuItem.description}</p>
                    <div className="menu-price">{formatCurrency(menuItem.price)}</div>
                    <Link to={`/menu/${menuItem.id}`} className="details-button">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Coffee size={48} />
              <h3>Menu Tidak Ditemukan</h3>
              <p>Coba kata kunci pencarian lain atau lihat semua menu kami.</p>
              {searchTerm && (
                <button 
                  className="reset-button"
                  onClick={() => setSearchTerm('')}
                >
                  Lihat Semua Menu
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;