
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Auth } from './Auth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
};
