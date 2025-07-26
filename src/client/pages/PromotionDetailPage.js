import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './PromotionDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import { Tag, Percent, Calendar, ArrowLeft, Ticket, Menu, Package } from 'lucide-react';
import logoImage from '../../images/logo.png';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navbar states
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  // Navbar functions
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  // Go back to promotions list
  const handleBackToPromos = () => {
    navigate('/promotions');
  };
  
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/promotions/${id}`);
        setPromotion(response.data);
      } catch (error) {
        console.error('Failed to fetch promotion details:', error);
        setError('Gagal memuat detail promosi. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPromotionDetails();
    }
  }, [id]);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    <div className={`promotion-detail-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component */}
      <header className={`navbar promotion-detail-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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

      {/* Back Button */}
      <div className="back-to-promos">
        <div className="container">
          <button className="back-button" onClick={handleBackToPromos}>
            <ArrowLeft size={20} />
            <span>Kembali ke Daftar Promo</span>
          </button>
        </div>
      </div>
      
      {/* Promotion Detail Content */}
      <section className="section promotion-detail-section">
        <div className="container">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleBackToPromos} className="back-button">
                Kembali ke Daftar Promo
              </button>
            </div>
          ) : promotion ? (
            <div className="promotion-detail">
              {/* Promotion Header */}
              <div className="promotion-detail-header">
                <div className="title-area">
                  <h1>{promotion.title}</h1>
                  <div className="promotion-meta">
                    <div className="discount-badge">
                      <Percent size={16} />
                      <span>{promotion.discount_percent}% OFF</span>
                    </div>
                    <div className="validity-period">
                      <Calendar size={16} />
                      <span>
                        Berlaku: {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {promotion.image_url && (
                  <div className="promotion-image">
                    <img 
                      src={getImageUrl(promotion.image_url)} 
                      alt={promotion.title}
                    />
                  </div>
                )}
              </div>
              
              {/* Promotion Description */}
              <div className="promotion-detail-content">
                <div className="description-section">
                  <h2>Deskripsi Promo</h2>
                  <p>{promotion.description}</p>
                </div>
                
                {/* Terms and Conditions */}
                <div className="terms-section">
                  <h2>Syarat dan Ketentuan</h2>
                  <div className="terms-content">
                    <Ticket size={20} />
                    <p>{promotion.terms || 'Tidak ada syarat khusus untuk promo ini.'}</p>
                  </div>
                </div>
                
                {/* Available Packages */}
                <div className="packages-section">
                  <h2>Paket yang Tersedia</h2>
                  {promotion.packages && promotion.packages.length > 0 ? (
                    <div className="packages-grid">
                      {promotion.packages.map((pkg) => (
                        <div key={pkg.id} className="package-card">
                          <div className="package-icon">
                            <Package size={28} />
                          </div>
                          <div className="package-details">
                            <h3>{pkg.name}</h3>
                            <div className="price-comparison">
                              <span className="original-price">
                                {formatCurrency(pkg.price * 100 / (100 - promotion.discount_percent))}
                              </span>
                              <span className="discounted-price">
                                {formatCurrency(pkg.price)}
                              </span>
                              <span className="discount-label">
                                {promotion.discount_percent}% OFF
                              </span>
                            </div>
                            <Link to={`/packages/${pkg.id}`} className="view-package-button">
                              Lihat Detail Paket
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-packages">Tidak ada paket yang tersedia untuk promo ini.</p>
                  )}
                </div>
              </div>
              
              {/* Call-to-Action Section */}
              <div className="promotion-cta">
                <div className="cta-content">
                  <h2>Tertarik dengan Promo Ini?</h2>
                  <p>Jangan lewatkan kesempatan untuk mendapatkan diskon spesial ini. Hubungi kami sekarang untuk informasi lebih lanjut atau pemesanan.</p>
                </div>
                <a 
                  href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20promo%20${promotion.title}.%20Bisakah%20saya%20mendapatkan%20informasi%20lebih%20lanjut?`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="book-button"
                >
                  Pesan Sekarang via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="error-message">
              <p>Promo tidak ditemukan.</p>
              <button onClick={handleBackToPromos} className="back-button">
                Kembali ke Daftar Promo
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PromotionDetailPage;