import React, { useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme as lightTheme } from '../styles/theme';
import { GlobalStyles } from '../styles/globalStyles';

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#1a1a1a',
    text: '#ffffff',
    textLight: '#999999',
    border: '#333333',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        {children}
      </>
    </StyledThemeProvider>
  );
}; 