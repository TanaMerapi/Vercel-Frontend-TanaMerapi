import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import './PackagesPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import { Search, Package, Menu } from 'lucide-react';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import logoImage from '../../images/logo.png';

const PackagesPage = () => {
  const socialMedia = useOutletContext();
  const [packages, setPackages] = useState([]);
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
    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        setPackages(response.data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
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
  
  const filteredPackages = packages.filter(pkg => {
    return (
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className={`packages-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar packages-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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

      <section className="packages-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Package size={62} className="title-icon" />
              <div>
                <h1>Paket Wisata</h1>
                <p>Jelajahi berbagai paket wisata menarik di kawasan Tanah Merapi</p>
              </div>
            </div>
            
            <div className="search-container">
              <div className="search-input">
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="Cari paket wisata..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section packages-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : filteredPackages.length > 0 ? (
            <div className="packages-grid">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="package-card">
                  <div className="package-image">
                    <img 
                      src={getImageUrl(pkg.image_url)} 
                      alt={pkg.name}
                    />
                  </div>
                  <div className="package-info">
                    <h3>{pkg.name}</h3>
                    {pkg.route && (
                      <div className="package-route">
                        <span className="route-label">Rute:</span>
                        <span className="route-text">{pkg.route}</span>
                      </div>
                    )}
                    <p>{pkg.description}</p>
                    
                    <div className="package-footer">
                      <div className="package-price">{formatCurrency(pkg.price)}</div>
                      <Link to={`/packages/${pkg.id}`} className="details-button">
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="icon-container">
                <div className="icon-group">
                  <Package size={48} />
                </div>
              </div>
              <h3>Paket Tidak Ditemukan</h3>
              <p>Coba kata kunci pencarian lain atau lihat semua paket kami.</p>
              {searchTerm && (
                <button 
                  className="reset-button"
                  onClick={() => setSearchTerm('')}
                >
                  Lihat Semua Paket
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;