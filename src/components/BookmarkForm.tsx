import React, { useState } from 'react';
import { BookmarkFormData } from '../types';
import Input from './Input';
import TextArea from './TextArea';
import Button from './Button';
import InsightInput from './InsightInput';
import PersonalGrowthInput from './PersonalGrowthInput';

interface BookmarkFormProps {
  onSubmit: (data: BookmarkFormData) => void;
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BookmarkFormData>({
    url: '',
    title: '',
    description: '',
    insights: [],
    personalGrowthNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsightChange = (insights: string[]) => {
    setFormData((prev) => ({ ...prev, insights }));
  };

  const handlePersonalGrowthChange = (notes: string) => {
    setFormData((prev) => ({ ...prev, personalGrowthNotes: notes }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ url: '', title: '', description: '', insights: [], personalGrowthNotes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        placeholder="URL"
        value={formData.url}
        onChange={handleChange}
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="mb-2"
      />
      <TextArea
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="mb-2"
      />
      <InsightInput insights={formData.insights} onInsightChange={handleInsightChange} />
      <PersonalGrowthInput
        notes={formData.personalGrowthNotes}
        onNotesChange={handlePersonalGrowthChange}
      />
      <Button onClick={handleSubmit}>Add Bookmark</Button>
    </form>
  );
};

export default BookmarkForm;