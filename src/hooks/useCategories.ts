import { useMemo } from 'react';
import { Bookmark } from '../types/bookmark';

export const useCategories = (bookmarks: Bookmark[]) => {
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    bookmarks.forEach(bookmark => {
      if (bookmark.category) {
        categoryMap.set(
          bookmark.category,
          (categoryMap.get(bookmark.category) || 0) + 1
        );
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookmarks]);

  return { categories };
}; 