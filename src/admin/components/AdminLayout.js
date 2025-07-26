// AdminLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Image, 
  Coffee, 
  Package, 
  Tag, 
  Share2,
  Settings 
} from 'lucide-react';
import './AdminLayout.scss';
import api from '../../utils/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check window size and close sidebar if window is too small
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check when component mounts
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await api.delete('/auth/logout');
      localStorage.removeItem('accessToken');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem('accessToken');
      navigate('/admin/login');
    }
  };
  
  const isActive = (path) => {
    return location.pathname === `/admin${path}` ? 'active' : '';
  };
  
  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Tanah Merapi</h1>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin" className={isActive('')}>
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/site-settings" className={isActive('/site-settings')}>
                <Settings size={20} />
                <span>Pengaturan Beranda</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/slides" className={isActive('/slides')}>
                <Image size={20} />
                <span>Slides</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/menu-items" className={isActive('/menu-items')}>
                <Coffee size={20} />
                <span>Menu</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/packages" className={isActive('/packages')}>
                <Package size={20} />
                <span>Paket</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/promotions" className={isActive('/promotions')}>
                <Tag size={20} />
                <span>Promo</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/social-media" className={isActive('/social-media')}>
                <Share2 size={20} />
                <span>Social Media</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="content">
        <header className="content-header">
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          
          <h2 className="page-title">
            {location.pathname === '/admin' && 'Dashboard'}
            {location.pathname === '/admin/site-settings' && 'Pengaturan Beranda'}
            {location.pathname === '/admin/slides' && 'Kelola Slides'}
            {location.pathname === '/admin/menu-items' && 'Kelola Menu'}
            {location.pathname === '/admin/packages' && 'Kelola Paket'}
            {location.pathname === '/admin/promotions' && 'Kelola Promo'}
            {location.pathname === '/admin/social-media' && 'Kelola Social Media'}
          </h2>
          
          <div className="header-actions">
            <button className="preview-button" onClick={() => window.open('/', '_blank')}>
              Preview Site
            </button>
          </div>
        </header>
        
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;