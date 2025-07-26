import React from 'react';
import './SocialMediaIcon.scss';
import instagramIcon from '../../images/instagram.png';
import tiktokIcon from '../../images/tiktok.png';
import whatsappIcon from '../../images/whatsapp.png';

const SocialMediaIcon = ({ platform, url, isLarge = false }) => {
  // Get the appropriate icon based on platform
  const getIconSrc = (platform) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        return instagramIcon;
      case 'tiktok':
        return tiktokIcon;
      case 'whatsapp':
        return whatsappIcon;
      default:
        return null;
    }
  };

  const iconSrc = getIconSrc(platform);

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`social-media-link ${isLarge ? 'large' : ''} ${platform.toLowerCase()}`}
      aria-label={platform}
    >
      {iconSrc ? (
        <img src={iconSrc} alt={platform} />
      ) : (
        // Fallback for platforms without custom icons
        <span>{platform}</span>
      )}
    </a>
  );
};

export default SocialMediaIcon;