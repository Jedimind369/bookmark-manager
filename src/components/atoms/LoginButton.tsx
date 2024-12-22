import React from 'react';
import styled from 'styled-components';
import { Google as GoogleIcon } from '@mui/icons-material';
import { authService } from '../../services/firebase/authService';
import { Button } from './Button';

const StyledButton = styled(Button)`
  gap: ${({ theme }) => theme.spacing.small};
`;

export const LoginButton: React.FC = () => {
  const handleLogin = async () => {
    try {
      await authService.signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <StyledButton onClick={handleLogin} variant="primary" size="large">
      <GoogleIcon />
      Sign in with Google
    </StyledButton>
  );
}; 