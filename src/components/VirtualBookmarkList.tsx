import React, { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Bookmark } from '../types';
import { ExternalLink } from 'lucide-react';

interface VirtualBookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

const VirtualBookmarkList: React.FC<VirtualBookmarkListProps> = ({ bookmarks, onDelete }) => {
  const [listHeight, setListHeight] = useState(window.innerHeight - 300);

  useEffect(() => {
    const handleResize = () => setListHeight(window.innerHeight - 300);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const bookmark = bookmarks[index];
    if (!bookmark) return null;

    return (
      <div style={style} className="p-4 border-b">
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
          <span className="font-semibold">Categories:</span> {bookmark.categories?.join(', ') || 'N/A'}
        </div>
        <div className="mt-1">
          <span className="font-semibold">Tags:</span> {bookmark.tags?.join(', ') || 'N/A'}
        </div>
        <div className="mt-2">
          <span className="font-semibold">Insights:</span>
          {bookmark.insights && bookmark.insights.length > 0 ? (
            <ul className="list-disc list-inside">
              {bookmark.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          ) : (
            <p>No insights added</p>
          )}
        </div>
        <div className="mt-2">
          <span className="font-semibold">Personal Growth Notes:</span>
          <p>{bookmark.personalGrowthNotes || 'No notes added'}</p>
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Added on: {new Date(bookmark.dateAdded).toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ width }) => (
        <List
          height={listHeight}
          itemCount={bookmarks.length}
          itemSize={300}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

export default VirtualBookmarkList;