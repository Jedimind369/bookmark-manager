import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all ${({ theme }) => theme.transitions.default};
  font-weight: 500;

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`padding: 6px 12px;`;
      case 'large':
        return css`padding: 12px 24px;`;
      default:
        return css`padding: 8px 16px;`;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'outline':
        return css`
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          background: transparent;
          &:hover {
            background: ${theme.colors.primary}10;
          }
        `;
      case 'text':
        return css`
          color: ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary}10;
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.primary}dd;
          }
        `;
    }
  }}
`; 