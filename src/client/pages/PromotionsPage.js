import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PromotionsPage.scss';
import Loader from '../../shared/components/Loader';
import { formatDate } from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import { Tag, Percent, Calendar, AlertCircle, Ticket, Menu } from 'lucide-react';
import logoImage from '../../images/logo.png';

const PromotionsPage = () => {
  const socialMedia = useOutletContext();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Navbar states - copied from HomePage
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  // Navbar functions - copied from HomePage
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  // Navigate to promotion detail page
  const handleViewPromotion = (promotionId) => {
    navigate(`/promotions/${promotionId}`);
  };
  
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/promotions');
        
        // Filter only active promotions
        const now = new Date();
        const activePromotions = response.data.filter(promo => {
          const validUntil = new Date(promo.valid_until);
          return validUntil >= now;
        });
        
        setPromotions(activePromotions);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
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
  
  return (
    <div className={`promotions-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar promotions-list-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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
      <section className="promotions-header">
        <div className="container">
          <div className="header-content">
            <div className="title-area">
              <Ticket size={62} className="title-icon" />
              <div>
                <h1>Promo Spesial</h1>
                <p>Nikmati penawaran terbaik untuk pengalaman di Tanah Merapi</p>
              </div>
            </div>
            <div className="promotions-stats">
              <div className="stat-item">
                <span className="stat-value">{promotions.length}</span>
                <span className="stat-label">Promo Aktif</span>
              </div>
              {promotions.length > 0 && (
                <div className="stat-item">
                  <span className="stat-value">
                    {Math.max(...promotions.map(p => p.discount_percent))}%
                  </span>
                  <span className="stat-label">Diskon Terbesar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotions Section - Simplified */}
      <section className="section promotions-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : promotions.length > 0 ? (
            <div className="promotions-grid">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  {/* Add image section */}
                  {promotion.image_url && (
                    <div className="promotion-card-image">
                      <img 
                        src={getImageUrl(promotion.image_url)} 
                        alt={promotion.title}
                      />
                      <div className="discount-badge">
                        <Percent size={16} />
                        <span>{promotion.discount_percent}% OFF</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="promotion-card-content">
                    {/* Card Header with Discount Badge - moved badge to image if available */}
                    <div className="promotion-card-header">
                      <h3>{promotion.title}</h3>
                      {!promotion.image_url && (
                        <div className="discount-badge">
                          <Percent size={16} />
                          <span>{promotion.discount_percent}% OFF</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Expiry Date */}
                    <div className="promotion-expiry">
                      <Calendar size={16} />
                      <span>Berakhir {formatDate(promotion.valid_until)}</span>
                    </div>
                    
                    {/* Available Packages */}
                    <div className="promotion-packages-section">
                      <h4>Paket yang Tersedia:</h4>
                      {promotion.packages && promotion.packages.length > 0 ? (
                        <ul className="packages-preview">
                          {promotion.packages.map((pkg) => (
                            <li key={pkg.id}>
                              <span>{pkg.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-packages">Tidak ada paket yang tersedia.</p>
                      )}
                    </div>
                    
                    {/* Action Button - Changed to "Lihat Syarat dan Ketentuan" */}
                    <button 
                      className="view-details-button"
                      onClick={() => handleViewPromotion(promotion.id)}
                    >
                      Lihat Syarat dan Ketentuan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-promotions">
              <AlertCircle size={48} />
              <h3>Tidak Ada Promo Saat Ini</h3>
              <p>Saat ini tidak ada promo yang tersedia. Silakan kunjungi kembali di lain waktu untuk penawaran spesial.</p>
              <Link to="/packages" className="view-packages-button">
                Lihat Paket Kami
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;