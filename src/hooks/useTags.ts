import { useMemo } from 'react';
import { Bookmark } from '../types/bookmark';

export const useTags = (bookmarks: Bookmark[]) => {
  const tags = useMemo(() => {
    const tagMap = new Map<string, number>();
    
    bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookmarks]);

  return { tags };
}; 