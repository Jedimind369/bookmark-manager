import React, { useState } from 'react';
import { InsightInputProps } from '../types';
import Input from './Input';
import Button from './Button';

const InsightInput: React.FC<InsightInputProps> = ({ insights, onInsightChange }) => {
  const [newInsight, setNewInsight] = useState('');

  const handleAddInsight = () => {
    if (newInsight.trim()) {
      onInsightChange([...insights, newInsight.trim()]);
      setNewInsight('');
    }
  };

  const handleRemoveInsight = (index: number) => {
    const updatedInsights = insights.filter((_, i) => i !== index);
    onInsightChange(updatedInsights);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add an insight"
          value={newInsight}
          onChange={(e) => setNewInsight(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleAddInsight}>Add</Button>
      </div>
      <ul className="list-disc list-inside">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>{insight}</span>
            <button
              onClick={() => handleRemoveInsight(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsightInput;