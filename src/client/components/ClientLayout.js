import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Footer from './Footer';
import './ClientLayout.scss';
import api from '../../utils/api';
import Loader from '../../shared/components/Loader';

const ClientLayout = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // This hook gives us the current route
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await api.get('/social-media');
        setSocialMedia(response.data);
      } catch (error) {
        console.error('Failed to fetch social media links:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSocialMedia();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="client-layout">
      {/* Only render the Navbar component if we're NOT on the homepage */}
      
      <main className="main-content">
        <Outlet context={socialMedia} />
      </main>
      
      <Footer socialMedia={socialMedia} />
    </div>
  );
};

export default ClientLayout;