import React, { useRef, useState } from 'react';
import Button from './Button';
import { parseBookmarksFile, processBookmarkWithAI } from '../utils/bookmarkProcessing';
import { addBookmarksBatch } from '../utils/db';
import { Bookmark } from '../types';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onUploadComplete: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setProgress(0);
      onFileUpload(file);

      try {
        const bookmarks = await parseBookmarksFile(file);
        const totalBookmarks = bookmarks.length;
        const processedBookmarks: Bookmark[] = [];

        for (let i = 0; i < totalBookmarks; i++) {
          const processedBookmark = await processBookmarkWithAI(bookmarks[i]);
          processedBookmarks.push(processedBookmark);
          setProgress(Math.round(((i + 1) / totalBookmarks) * 100));
        }

        await addBookmarksBatch(processedBookmarks);
        onUploadComplete();
      } catch (error) {
        console.error('Error processing bookmarks:', error);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".html"
        style={{ display: 'none' }}
      />
      <Button onClick={handleButtonClick} disabled={isUploading}>
        {isUploading ? `Uploading... ${progress}%` : 'Upload Bookmarks File'}
      </Button>
    </div>
  );
};

export default FileUpload;