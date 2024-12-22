import React from 'react';
import styled from 'styled-components';
import { DarkMode, LightMode } from '@mui/icons-material';
import { Button } from './Button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const StyledButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.small};
`;

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <StyledButton onClick={onToggle} variant="text">
      {isDark ? <LightMode /> : <DarkMode />}
    </StyledButton>
  );
}; 