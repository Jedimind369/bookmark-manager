import { ReactNode } from 'react';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  dateAdded: Date;
  userId: string;
  analysis?: {
    summary: string;
    keyInsights: string[];
    credibilityScore: number;
    readingTime: number;
  };
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description: string;
  tags: string[];
}

// ... (keep the rest of the existing types)

export interface InsightInputProps {
  insights: string[];
  onInsightChange: (insights: string[]) => void;
}

export interface PersonalGrowthInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}