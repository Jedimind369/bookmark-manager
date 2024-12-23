import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Bookmark } from '../types';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete?: (id: string) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onDelete }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const bookmark = bookmarks[index];
    return (
      <div style={style} className="p-4 border-b hover:bg-gray-50">
        <h3 className="text-lg font-semibold">{bookmark.title}</h3>
        <a href={bookmark.url} className="text-blue-500 hover:underline">{bookmark.url}</a>
        {bookmark.description && (
          <p className="text-gray-600 mt-1">{bookmark.description}</p>
        )}
        <div className="flex gap-2 mt-2">
          {bookmark.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        {onDelete && bookmark.id && (
          <button
            onClick={() => onDelete(bookmark.id!)}
            className="mt-2 text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="h-[600px] w-full">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={bookmarks.length}
            itemSize={150}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default BookmarkList;