
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/pages/LoginPage';
import { Layout } from './components/templates/Layout';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Layout /> : <LoginPage />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
