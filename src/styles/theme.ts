export const theme = {
  colors: {
    primary: '#0066cc',
    secondary: '#666666',
    background: '#ffffff',
    text: '#333333',
    textLight: '#666666',
    border: '#e1e1e1',
    error: '#dc3545',
    success: '#28a745'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  },
  borderRadius: '6px',
  transitions: {
    default: '0.3s ease'
  }
};

export type Theme = typeof theme; 