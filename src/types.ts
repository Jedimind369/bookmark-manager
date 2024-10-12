import { ReactNode } from 'react';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  dateAdded: Date;
  insights: string[];
  personalGrowthNotes: string;
  relatedConcepts: string[];
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description: string;
  insights: string[];
  personalGrowthNotes: string;
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