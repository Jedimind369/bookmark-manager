import React from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  padding-left: ${({ theme }) => theme.spacing.large};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Icon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.small};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search bookmarks...'
}) => {
  return (
    <Container>
      <Icon>
        <SearchIcon />
      </Icon>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Container>
  );
}; 