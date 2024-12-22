import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarkService } from '../../services/firebase/bookmarkService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 16px;
`;

export const BookmarkForm = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await bookmarkService.addBookmark(user.uid, {
        url,
        title,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
      });

      setUrl('');
      setTitle('');
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        required
      />
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        required
      />
      <Button type="submit" variant="primary">
        Add Bookmark
      </Button>
    </Form>
  );
}; 