import React from 'react';
import styled from 'styled-components';
import { LoginButton } from '../atoms/LoginButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.large};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.large};
  color: ${({ theme }) => theme.colors.text};
`;

export const LoginPage: React.FC = () => {
  return (
    <Container>
      <Title>Bookmark Manager</Title>
      <LoginButton />
    </Container>
  );
}; 