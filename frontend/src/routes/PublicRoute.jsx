import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return !user ? children : <Navigate to="/inicio" />;
};

export default PublicRoute;
