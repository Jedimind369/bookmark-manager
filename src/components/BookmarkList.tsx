import React from 'react';
import { Bookmark } from '../types';
import { ExternalLink } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onDelete }) => {
  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{bookmark.title}</h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                {bookmark.url} <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
            <button
              onClick={() => onDelete(bookmark.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <p className="mt-2 text-gray-600">{bookmark.description}</p>
          <div className="mt-2">
            <span className="font-semibold">Categories:</span>{' '}
            {bookmark.categories.join(', ')}
          </div>
          <div className="mt-1">
            <span className="font-semibold">Tags:</span> {bookmark.tags.join(', ')}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Added on: {bookmark.dateAdded.toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkList;