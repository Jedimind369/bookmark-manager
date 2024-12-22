import React from 'react';
import styled from 'styled-components';
import { SignOutButton } from '../atoms/SignOutButton';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.large};
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Header>
        <h1>Bookmark Manager</h1>
        <SignOutButton />
      </Header>
      <Main>{children}</Main>
    </Container>
  );
}; 