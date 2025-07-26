// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Dashboard.scss';
import { 
  Image, 
  Coffee, 
  Package, 
  Tag, 
  Share2,
  Settings
} from 'lucide-react';
import Loader from '../../shared/components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    slides: 0,
    menuItems: 0,
    packages: 0,
    promotions: 0,
    socialMedia: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all endpoints
        const [
          slidesRes,
          menuItemsRes,
          packagesRes,
          promotionsRes,
          socialMediaRes
        ] = await Promise.all([
          api.get('/slides'),
          api.get('/menu-items'),
          api.get('/packages'),
          api.get('/promotions'),
          api.get('/social-media')
        ]);
        
        // Update stats
        setStats({
          slides: slidesRes.data.length,
          menuItems: menuItemsRes.data.length,
          packages: packagesRes.data.length,
          promotions: promotionsRes.data.length,
          socialMedia: socialMediaRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <div className="welcome-message">
          <h1>Selamat Datang di Admin Dashboard</h1>
          <p>Kelola konten website Tanah Merapi dengan mudah melalui dashboard ini.</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Settings size={28} />
          </div>
          <div className="stat-info">
            <h3>Pengaturan Beranda</h3>
            <p>Edit Konten</p>
          </div>
          <Link to="/admin/site-settings" className="stat-action">
            Kelola Beranda
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Image size={28} />
          </div>
          <div className="stat-info">
            <h3>Slides</h3>
            <p>{stats.slides}</p>
          </div>
          <Link to="/admin/slides" className="stat-action">
            Kelola Slides
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Coffee size={28} />
          </div>
          <div className="stat-info">
            <h3>Menu</h3>
            <p>{stats.menuItems}</p>
          </div>
          <Link to="/admin/menu-items" className="stat-action">
            Kelola Menu
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={28} />
          </div>
          <div className="stat-info">
            <h3>Paket</h3>
            <p>{stats.packages}</p>
          </div>
          <Link to="/admin/packages" className="stat-action">
            Kelola Paket
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={28} />
          </div>
          <div className="stat-info">
            <h3>Promo</h3>
            <p>{stats.promotions}</p>
          </div>
          <Link to="/admin/promotions" className="stat-action">
            Kelola Promo
          </Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Share2 size={28} />
          </div>
          <div className="stat-info">
            <h3>Social Media</h3>
            <p>{stats.socialMedia}</p>
          </div>
          <Link to="/admin/social-media" className="stat-action">
            Kelola Social Media
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;