import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import './MenuDetailPage.scss';
import Loader from '../../shared/components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import { ArrowLeft, Coffee, Menu } from 'lucide-react';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import logoImage from '../../images/logo.png';

const MenuDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socialMedia = useOutletContext();
  const [menuItem, setMenuItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemResponse, allItemsResponse] = await Promise.all([
          api.get(`/menu-items/${id}`),
          api.get('/menu-items')
        ]);
        
        setMenuItem(itemResponse.data);
        
        // Get related items (excluding current item)
        const otherItems = allItemsResponse.data.filter(item => item.id !== parseInt(id));
        // Get random 3 items
        const randomItems = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRelatedItems(randomItems);
      } catch (error) {
        console.error('Failed to fetch menu item:', error);
        // If item not found, redirect to menu page
        if (error.response && error.response.status === 404) {
          navigate('/menu');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
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
  
  if (loading) {
    return <Loader />;
  }
  
  if (!menuItem) {
    return (
      <div className={`not-found-container ${isOpen ? 'is-sidebar-open' : ''}`}>
        {/* Navbar Component - copied from HomePage */}
        <header className={`navbar menu-detail-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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
        
        <Coffee size={48} />
        <h2>Menu tidak ditemukan</h2>
        <p>Menu yang Anda cari tidak tersedia.</p>
        <Link to="/menu" className="back-button">
          <ArrowLeft size={18} /> Kembali ke Menu
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`menu-detail-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Navbar Component - copied from HomePage */}
      <header className={`navbar menu-detail-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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

      <div className="container">
        <div className="breadcrumb">
          <Link to="/menu">
            <ArrowLeft size={18} /> Kembali ke Menu
          </Link>
        </div>
        
        <div className="menu-detail">
          <div className="menu-image">
            <img 
              src={getImageUrl(menuItem.image_url)} 
              alt={menuItem.name}
            />
          </div>
          
          <div className="menu-info">
            <h1>{menuItem.name}</h1>
            <div className="menu-price">{formatCurrency(menuItem.price)}</div>
            <div className="menu-description">
              <h3>Deskripsi</h3>
              <p>{menuItem.description || 'Tidak ada deskripsi untuk menu ini.'}</p>
            </div>
            <div className="menu-cta">
              <a 
                href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${menuItem.name}.%20Apakah%20masih%20tersedia?`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="order-button"
              >
                Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
        
        {relatedItems.length > 0 && (
          <div className="related-menu">
            <h2>Menu Lainnya</h2>
            <div className="related-grid">
              {relatedItems.map((item) => (
                <Link key={item.id} to={`/menu/${item.id}`} className="related-card">
                  <div className="related-image">
                    <img 
                      src={getImageUrl(item.image_url)} 
                      alt={item.name}
                    />
                  </div>
                  <div className="related-info">
                    <h3>{item.name}</h3>
                    <div className="related-price">{formatCurrency(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDetailPage;