// AdminRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import SiteSettingsPage from './pages/SiteSettingsPage';
import SlidesList from './pages/SlidesList';
import MenuItemsList from './pages/MenuItemsList';
import PackagesList from './pages/PackagesList';
import PromotionsList from './pages/PromotionsList';
import SocialMediaList from './pages/SocialMediaList';
import ProtectedRoute from './components/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="site-settings" element={<SiteSettingsPage />} />
        <Route path="slides" element={<SlidesList />} />
        <Route path="menu-items" element={<MenuItemsList />} />
        <Route path="packages" element={<PackagesList />} />
        <Route path="promotions" element={<PromotionsList />} />
        <Route path="social-media" element={<SocialMediaList />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;