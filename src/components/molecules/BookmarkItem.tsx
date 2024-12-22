import React from 'react';
import styled from 'styled-components';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button } from '../atoms/Button';
import { Tag } from '../atoms/Tag';
import { Bookmark } from '../../types/bookmark';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.a`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onDelete }) => {
  return (
    <Container>
      <Header>
        <Title href={bookmark.url} target="_blank" rel="noopener noreferrer">
          {bookmark.title}
        </Title>
        <Button
          variant="text"
          size="small"
          onClick={() => onDelete(bookmark.id)}
        >
          <DeleteIcon />
        </Button>
      </Header>
      {bookmark.description && (
        <p>{bookmark.description}</p>
      )}
      {bookmark.tags.length > 0 && (
        <TagList>
          {bookmark.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagList>
      )}
    </Container>
  );
}; 