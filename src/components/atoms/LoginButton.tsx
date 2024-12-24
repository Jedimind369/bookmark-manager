
import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { authService } from '../../services/authService';

const StyledButton = styled(Button)`
  padding: 12px 24px;
  font-size: 16px;
`;

export const LoginButton: React.FC = () => {
  const handleLogin = () => {
    authService.login();
  };

  return (
    <StyledButton onClick={handleLogin} variant="primary" size="large">
      Sign in with Replit
    </StyledButton>
  );
};
