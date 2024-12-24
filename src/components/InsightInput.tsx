import React, { useState } from 'react';
import { TextArea } from './TextArea';

interface InsightInputProps {
  onInsightAdd: (insight: string) => void;
  className?: string;
}

export const InsightInput: React.FC<InsightInputProps> = ({ onInsightAdd, className = '' }) => {
  const [insight, setInsight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (insight.trim()) {
      onInsightAdd(insight.trim());
      setInsight('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <TextArea
        value={insight}
        onChange={setInsight}
        placeholder="Add your insights about this bookmark..."
        rows={3}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!insight.trim()}
      >
        Add Insight
      </button>
    </form>
  );
};