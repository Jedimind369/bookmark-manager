import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarkService } from '../../services/firebase/bookmarkService';
import { Bookmark } from '../../types/bookmark';
import { BookmarkItem } from '../molecules/BookmarkItem';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

export const BookmarkList = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);

  React.useEffect(() => {
    if (!user) return;

    const unsubscribe = bookmarkService.subscribeToBookmarks(
      user.uid,
      setBookmarks
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (bookmarkId: string) => {
    if (!user) return;
    try {
      await bookmarkService.deleteBookmark(user.uid, bookmarkId);
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  return (
    <List>
      {bookmarks.map(bookmark => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
        />
      ))}
    </List>
  );
}; 