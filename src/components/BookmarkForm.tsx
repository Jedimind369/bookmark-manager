
import React, { useState } from 'react';
import { BookmarkFormData } from '../types';

interface Props {
  onSubmit: (data: BookmarkFormData) => void;
}

const BookmarkForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BookmarkFormData>({
    url: '',
    title: '',
    description: '',
    tags: [],
    collections: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ url: '', title: '', description: '', tags: [], collections: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="url"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        placeholder="URL"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={formData.tags.join(', ')}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Add Bookmark
      </button>
    </form>
  );
};

export default BookmarkForm;
