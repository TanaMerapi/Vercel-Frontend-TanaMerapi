import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PromotionDetailPage.scss';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Calendar, Package, Percent, ArrowLeft, Clock, Info } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const PromotionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch promotion data
  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/promotions/${id}`);
      setPromotion(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch promotion:', error);
      setError('Gagal memuat detail promo. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    return originalPrice - (originalPrice * discountPercent / 100);
  };

  // Check if promotion is active
  const isPromotionActive = () => {
    if (!promotion) return false;
    const now = new Date();
    const validUntil = new Date(promotion.valid_until);
    return validUntil >= now;
  };

  // Get promotion status
  const getPromotionStatus = () => {
    if (!promotion) return { text: '', className: '' };
    
    const now = new Date();
    const validFrom = new Date(promotion.valid_from);
    const validUntil = new Date(promotion.valid_until);
    
    if (now < validFrom) {
      return { text: 'Belum Dimulai', className: 'upcoming' };
    } else if (now > validUntil) {
      return { text: 'Berakhir', className: 'expired' };
    } else {
      return { text: 'Aktif', className: 'active' };
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="promotion-detail-page">
        <Message 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="promotion-detail-page">
        <Message 
          type="error" 
          message="Promo tidak ditemukan" 
        />
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const status = getPromotionStatus();

  return (
    <div className="promotion-detail-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Kembali
        </button>
      </div>

      <div className="promotion-detail-container">
        {/* Hero Section */}
        <div className="promotion-hero">
          <div className="hero-image">
            <img 
              src={getImageUrl(promotion.image_url)} 
              alt={promotion.title}
              onError={(e) => {
                // Fallback to first package image if promotion image fails
                if (promotion.packages && promotion.packages[0]) {
                  e.target.src = getImageUrl(promotion.packages[0].image_url);
                }
              }}
            />
            <div className="hero-overlay">
              <div className="discount-badge">
                <Percent size={20} />
                <span>{promotion.discount_percent}% OFF</span>
              </div>
              <div className={`status-badge ${status.className}`}>
                {status.text}
              </div>
            </div>
          </div>
          
          <div className="hero-content">
            <h1 className="promotion-title">{promotion.title}</h1>
            {promotion.description && (
              <p className="promotion-description">{promotion.description}</p>
            )}
            
            <div className="promotion-meta">
              <div className="meta-item">
                <Calendar size={18} />
                <span>
                  {formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}
                </span>
              </div>
              
              <div className="meta-item">
                <Package size={18} />
                <span>
                  {promotion.packages?.length || 0} Paket Tersedia
                </span>
              </div>
              
              <div className="meta-item">
                <Clock size={18} />
                <span className={`status-text ${status.className}`}>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Packages */}
        {promotion.packages && promotion.packages.length > 0 && (
          <div className="packages-section">
            <h2>
              <Package size={20} />
              Paket yang Tersedia
            </h2>
            
            <div className="packages-grid">
              {promotion.packages.map(pkg => (
                <div key={pkg.id} className="package-card">
                  <div className="package-image">
                    <img 
                      src={getImageUrl(pkg.image_url)} 
                      alt={pkg.name}
                    />
                    <div className="discount-overlay">
                      -{promotion.discount_percent}%
                    </div>
                  </div>
                  
                  <div className="package-content">
                    <h3 className="package-name">{pkg.name}</h3>
                    
                    <div className="package-prices">
                      <div className="price-comparison">
                        <span className="original-price">
                          {formatCurrency(pkg.price)}
                        </span>
                        <span className="discounted-price">
                          {formatCurrency(calculateDiscountedPrice(pkg.price, promotion.discount_percent))}
                        </span>
                      </div>
                      <div className="savings">
                        Hemat {formatCurrency(pkg.price * promotion.discount_percent / 100)}
                      </div>
                    </div>
                    
                    {pkg.description && (
                      <p className="package-description">{pkg.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="terms-section">
          <h2>
            <Info size={20} />
            Syarat dan Ketentuan
          </h2>
          
          <div className="terms-content">
            {promotion.terms ? (
              <div className="terms-text">
                {promotion.terms.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="no-terms">Tidak ada syarat dan ketentuan khusus.</p>
            )}
          </div>
          
          <div className="promotion-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Periode Promo:</label>
                <span>{formatDate(promotion.valid_from)} - {formatDate(promotion.valid_until)}</span>
              </div>
              
              <div className="info-item">
                <label>Diskon:</label>
                <span className="discount-text">{promotion.discount_percent}%</span>
              </div>
              
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-text ${status.className}`}>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {isPromotionActive() && (
          <div className="cta-section">
            <div className="cta-content">
              <h3>Tertarik dengan promo ini?</h3>
              <p>Hubungi kami untuk informasi lebih lanjut dan pemesanan.</p>
              <button className="contact-button">
                Hubungi Kami
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionDetailPage;