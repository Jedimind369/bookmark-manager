import React from 'react';
import styled from 'styled-components';
import { Tag } from '../atoms/Tag';

interface FilterSectionProps {
  title: string;
  items: Array<{ id: string; label: string }>;
  selectedItems: string[];
  onItemToggle: (id: string) => void;
}

const Container = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Title = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  selectedItems,
  onItemToggle
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <TagContainer>
        {items.map(({ id, label }) => (
          <Tag
            key={id}
            isSelected={selectedItems.includes(id)}
            onClick={() => onItemToggle(id)}
          >
            {label}
          </Tag>
        ))}
      </TagContainer>
    </Container>
  );
}; 