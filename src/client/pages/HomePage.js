// HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useOutletContext } from 'react-router-dom';
import Slider from 'react-slick';
import api from '../../utils/api';
import './HomePage.scss';
import Loader from '../../shared/components/Loader';
import { getImageUrl } from '../../utils/imageUrl'; // Import the helper
import merapiImage from '../../images/merapi.jpg';
import contohImage from '../../images/contoh.jpg';
import { ArrowRight, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import logoImage from '../../images/logo.png';

const HomePage = () => {
  const socialMedia = useOutletContext();
  const [slides, setSlides] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    home_description: '',
    home_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Navbar states
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  
  // Create a ref for the slider to access its methods
  const sliderRef = useRef(null);
  
  // Custom carousel images
  const carouselImages = [
    { src: contohImage, alt: "Tanah Merapi Jeep Track" },
  ];
  
  // Navbar functions
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
  
  // Get featured social media platforms
  const getFeaturedSocialMedia = () => {
    return socialMedia.filter(sm => 
      ['instagram', 'tiktok', 'whatsapp'].includes(sm.platform.toLowerCase())
    );
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slidesRes, 
          menuItemsRes, 
          packagesRes, 
          promotionsRes, 
          siteSettingsRes
        ] = await Promise.all([
          api.get('/slides'),
          api.get('/menu-items'),
          api.get('/packages'),
          api.get('/promotions'),
          api.get('/site-settings')
        ]);
        
        setSlides(slidesRes.data);
        setMenuItems(menuItemsRes.data.slice(0, 3)); // Just get first 3
        setPackages(packagesRes.data.slice(0, 3)); // Just get first 3
        setPromotions(promotionsRes.data);
        
        // Process site settings
        const settingsObj = {};
        siteSettingsRes.data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        
        setSiteSettings({
          home_description: settingsObj.home_description || '',
          home_image: settingsObj.home_image || ''
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Add background after scrolling 50px
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Removed document.body.style.overflow = 'auto' as it's now handled by CSS
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
  
  // Auto-slide effect - only when no slides from API
  useEffect(() => {
    if (slides.length === 0) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setIsTransitioning(true);
          setCurrentImageIndex((prev) => 
            prev === carouselImages.length - 1 ? 0 : prev + 1
          );
          setTimeout(() => setIsTransitioning(false), 500);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [slides.length, carouselImages.length, isTransitioning]);
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    arrows: false
  };
  
  // Navigation functions for the slider from react-slick
  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };
  
  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  
  // Custom carousel navigation functions
  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => 
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const goToImage = (index) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  // Get featured social media for display in hero
  const featuredSocialMedia = getFeaturedSocialMedia();
  
  return (
    <div className={`home-page ${isOpen ? 'is-sidebar-open' : ''}`}>
      {/* Hero Slider with Navbar overlay */}
      <section className="hero-slider">
        {/* Navbar Component directly inside the HomePage */}
        <header className={`navbar homepage-navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
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

        {slides.length > 0 ? (
          <div className="slider-container">
            <Slider ref={sliderRef} {...sliderSettings}>
              {slides.map((slide) => (
                <div key={slide.id} className="hero-slide">
                  <img 
                    src={getImageUrl(slide.image_url)} 
                    alt={slide.title}
                  />
                  <div className="hero-overlay"></div>
                  <div className="hero-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.description || 'Nikmati keindahan alam di lereng Gunung Merapi'}</p>
                  </div>
                </div>
              ))}
            </Slider>
            
            {/* Fixed CTA button and social media icons */}
            <div className="hero-fixed-content">
              <a 
                href="https://www.google.com/maps/place/Agrowisata+Petik+Jeruk/data=!4m2!3m1!1s0x2e7a670046094faf:0x530487b6ab12895c?sa=X&ved=1t:242&ictx=111" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cta-button"
              >
                Kunjungi Kami
              </a>
              <div className="hero-social-media">
                {featuredSocialMedia.map(sm => (
                  <SocialMediaIcon
                    key={sm.id}
                    platform={sm.platform}
                    url={sm.url}
                    isLarge={true}
                  />
                ))}
              </div>
            </div>
            
            {/* Custom Navigation Arrows for react-slick */}
            <button className="carousel-nav carousel-prev" onClick={goToPrev}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-nav carousel-next" onClick={goToNext}>
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <div className="custom-carousel">
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}vw)`
                }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="carousel-slide">
                    <img src={image.src} alt={image.alt} />
                    <div className="hero-overlay"></div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button className="carousel-nav carousel-prev" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className="carousel-nav carousel-next" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
              
              {/* Dots Indicator */}
              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
              
              <div className="hero-content">
                <h1>Selamat Datang di Tanah Merapi</h1>
                <p>Nikmati keindahan alam di lereng Gunung Merapi</p>
              </div>
              
              {/* Fixed CTA button and social media icons */}
              <div className="hero-fixed-content">
                <a 
                  href="https://www.google.com/maps/place/Agrowisata+Petik+Jeruk/data=!4m2!3m1!1s0x2e7a670046094faf:0x530487b6ab12895c?sa=X&ved=1t:242&ictx=111" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cta-button"
                >
                  Kunjungi Kami
                </a>
                <div className="hero-social-media">
                  {featuredSocialMedia.map(sm => (
                    <SocialMediaIcon
                      key={sm.id}
                      platform={sm.platform}
                      url={sm.url}
                      isLarge={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <h2 className="section-title">Tentang Tanah Merapi</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Wisata Alam Outdoor</h3>
              <p className="preserve-line-breaks">
                {siteSettings.home_description || 
                  'Tanah Merapi adalah destinasi wisata alam outdoor yang terletak di lereng Gunung Merapi, Yogyakarta. Kami menawarkan pengalaman wisata yang unik dengan pemandangan yang indah dan udara yang segar.'}
              </p>
              {/* Removed the hardcoded paragraph */}
            </div>
            <div className="about-image">
              <img 
                src={getImageUrl(siteSettings.home_image) || merapiImage} 
                alt="Tanah Merapi" 
              />
            </div>
            <div className="about-cta">
              <Link to="/contact" className="learn-more">
                Pelajari Lebih Lanjut <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Menu Preview Section */}
      <section className="section menu-preview-section">
        <div className="container">
          <h2 className="section-title">Menu Makanan dan Minuman</h2>
          <div className="menu-cards">
            {menuItems.map((menuItem) => (
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
                </div>
              </div>
            ))}
          </div>
          <div className="see-all">
            <Link to="/menu" className="see-all-button">
              Lihat Semua Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Packages Preview Section */}
      <section className="section packages-preview-section">
        <div className="container">
          <h2 className="section-title">Paket Jeep & Petik Jeruk</h2>
          <div className="package-cards">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <img 
                    src={getImageUrl(pkg.image_url)} 
                    alt={pkg.name}
                  />
                </div>
                <div className="package-info">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="package-details">
                    {pkg.items && pkg.items.length > 0 && (
                      <div className="package-items">
                        <span>Termasuk:</span>
                        <ul>
                          {pkg.items.slice(0, 3).map((item, index) => (
                            <li key={index}>{item.item_name}</li>
                          ))}
                          {pkg.items.length > 3 && <li>Dan lainnya...</li>}
                        </ul>
                      </div>
                    )}
                    <div className="package-price">{formatCurrency(pkg.price)}</div>
                  </div>
                  <Link to={`/packages/${pkg.id}`} className="details-button">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="see-all">
            <Link to="/packages" className="see-all-button">
              Lihat Semua Paket <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Promotions Preview Section */}
      {promotions.length > 0 && (
        <section className="section promotions-preview-section">
          <div className="container">
            <h2 className="section-title">Promo Spesial</h2>
            <div className="promotion-cards">
              {promotions.slice(0, 2).map((promotion) => (
                <div key={promotion.id} className="promotion-card">
                  <div className="promotion-content">
                    <h3>{promotion.title}</h3>
                    <p>{promotion.description}</p>
                    <div className="promotion-discount">
                      <span className="discount-tag">{promotion.discount_percent}% OFF</span>
                    </div>
                    <Link to="/promotions" className="details-button">
                      Lihat Detail
                    </Link>
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
              ))}
            </div>
            <div className="see-all">
              <Link to="/promotions" className="see-all-button">
                Lihat Semua Promo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <h2 className="section-title">Kontak & Lokasi</h2>
          <div className="contact-content">
            <div className="contact-map">
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
            </div>
            <div className="contact-info">
              <p>
                Jika Anda memiliki pertanyaan atau ingin melakukan reservasi, 
                jangan ragu untuk menghubungi kami melalui salah satu platform berikut:
              </p>
              <Link to="/contact" className="contact-button">
                Informasi Lengkap <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;