import React from 'react';
import { Bookmark } from '../types';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks }) => {
  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              {bookmark.title}
            </a>
          </h3>
          {bookmark.description && (
            <p className="mt-1 text-gray-600">{bookmark.description}</p>
          )}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {bookmark.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded-full text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};