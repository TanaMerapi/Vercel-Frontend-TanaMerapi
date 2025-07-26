import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientRoutes from './client/ClientRoutes';
import AdminRoutes from './admin/AdminRoutes';
import './App.scss';

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<ClientRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default App;