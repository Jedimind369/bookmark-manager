
import React from 'react';
import { Bookmark } from '../types';

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

const BookmarkList: React.FC<Props> = ({ bookmarks, onDelete }) => {
  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="p-4 border rounded shadow">
          <div className="flex justify-between">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {bookmark.title}
            </a>
            <button onClick={() => bookmark.id && onDelete(bookmark.id)} className="text-red-500">
              Delete
            </button>
          </div>
          {bookmark.description && <p className="text-gray-600 mt-2">{bookmark.description}</p>}
          {bookmark.tags.length > 0 && (
            <div className="mt-2 space-x-2">
              {bookmark.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
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

export default BookmarkList;
