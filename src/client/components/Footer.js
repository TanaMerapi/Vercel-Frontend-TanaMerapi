import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';
import SocialMediaIcon from '../../shared/components/SocialMediaIcon';
import { MapPin } from 'lucide-react';
import footerLogoImage from '../../images/footerlogo.png';

const Footer = ({ socialMedia }) => {
  const year = new Date().getFullYear();

  // Separate social media into featured (displayed prominently) and standard icons
  const featuredSocials = socialMedia.filter(social => 
    ['instagram', 'tiktok', 'whatsapp'].includes(social.platform.toLowerCase())
  );
  
  const standardSocials = socialMedia.filter(social => 
    !['instagram', 'tiktok', 'whatsapp'].includes(social.platform.toLowerCase())
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo">
              <img 
                src={footerLogoImage} 
                alt="Tanah Merapi Logo"
                className="logo-image"
              />
            </div>
          </div>
          
          <div className="footer-info footer-center">
            <p className="footer-description">
              Wisata kedai alam outdoor, petik jeruk dan jeep di lereng Gunung Merapi
              dengan pemandangan yang indah dan suasana yang menyegarkan.
            </p>

            {/* Featured Social Media Icons */}
            <div className="footer-social-media">
              {featuredSocials.map((social) => (
                <SocialMediaIcon 
                  key={social.id}
                  platform={social.platform}
                  url={social.url}
                  isLarge={true}
                />
              ))}
            </div>
          </div>
          
          <div className="footer-social"> 
            <div className="social-icons">
              {standardSocials.map((social) => (
                <SocialMediaIcon 
                  key={social.id}
                  platform={social.platform}
                  url={social.url}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} Tanah Merapi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;