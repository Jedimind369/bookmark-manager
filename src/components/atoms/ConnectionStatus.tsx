import React from 'react';
import styled from 'styled-components';
import { Wifi, WifiOff } from '@mui/icons-material';

interface ConnectionStatusProps {
  isOnline: boolean;
}

const Container = styled.div<{ isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  color: ${({ theme, isOnline }) => 
    isOnline ? theme.colors.success : theme.colors.error};
`;

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isOnline }) => {
  return (
    <Container isOnline={isOnline}>
      {isOnline ? <Wifi /> : <WifiOff />}
      {isOnline ? 'Connected' : 'Offline'}
    </Container>
  );
}; 