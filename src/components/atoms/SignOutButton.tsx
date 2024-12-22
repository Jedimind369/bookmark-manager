import React from 'react';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { authService } from '../../services/firebase/authService';
import { Button } from './Button';

export const SignOutButton: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      <LogoutIcon />
      Sign Out
    </Button>
  );
}; 