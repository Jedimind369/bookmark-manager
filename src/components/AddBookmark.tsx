
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBookmark } from '../store/bookmarksSlice';
import { bookmarkService } from '../services/firebase/bookmarkService';
import { Bookmark } from '../types/bookmark';
import Button from './atoms/Button';

export function AddBookmark() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: '',
    collections: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBookmark: Omit<Bookmark, 'id'> = {
      url: formData.url,
      title: formData.title,
      description: formData.description || '',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      collections: formData.collections.split(',').map(col => col.trim()).filter(Boolean),
      dateAdded: new Date(),
      userId: 'current-user-id', // Replace with actual user ID from auth context
      syncStatus: 'pending'
    };

    try {
      const bookmarkId = await bookmarkService.addBookmark('current-user-id', newBookmark);
      dispatch(addBookmark({ ...newBookmark, id: bookmarkId }));
      setIsOpen(false);
      setFormData({ url: '', title: '', description: '', tags: '', collections: '' });
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Add Bookmark</Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Bookmark</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Collections (comma-separated)"
                  value={formData.collections}
                  onChange={e => setFormData(prev => ({ ...prev, collections: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={() => setIsOpen(false)} type="button">Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
