import styled, { css } from 'styled-components';

interface TagProps {
  isSelected?: boolean;
}

export const Tag = styled.button<TagProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  transition: all ${({ theme }) => theme.transitions.default};
  
  ${({ isSelected, theme }) => 
    isSelected
      ? css`
          background: ${theme.colors.primary};
          color: white;
        `
      : css`
          background: ${theme.colors.primary}10;
          color: ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary}20;
          }
        `
  }
`; 