import React, { useState } from 'react';
import { FormState } from '../types';
import { Input } from './Input';
import { TextArea } from './TextArea';

interface BookmarkFormProps {
  onSubmit: (formData: FormState) => void;
  initialData?: Partial<FormState>;
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({ 
  onSubmit, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState<FormState>({
    url: initialData.url || '',
    title: initialData.title || '',
    description: initialData.description || '',
    tags: initialData.tags || [],
    collections: initialData.collections || [],
    insights: initialData.insights || [],
    categories: initialData.categories || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <Input
          type="url"
          value={formData.url}
          onChange={(value) => setFormData({ ...formData, url: value })}
          required
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          type="text"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          required
          placeholder="Bookmark title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <TextArea
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Add a description..."
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Bookmark
      </button>
    </form>
  );
};