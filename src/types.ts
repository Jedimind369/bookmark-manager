import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  uid: string;
}

export interface BookmarkAnalysis {
  summary: string;
  keyInsights: string[];
  credibilityScore: number;
  readingTime: number;
}

export interface Bookmark {
  id?: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  collections?: string[];
  categories?: string[];
  insights?: string[];
  dateAdded: Date;
  syncStatus?: 'pending' | 'synced' | 'error';
  userId?: string;
  metadata?: {
    visitCount?: number;
    lastVisited?: Date;
  };
  personalGrowthNotes?: string;
  analysis?: {
    summary?: string;
    credibilityScore?: number;
    keyInsights?: string[];
    readingTime?: number;
  };
  createdAt?: Date;
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description: string;
  tags: string[];
  collections: string[];
  insights: string[];
  categories: string[];
}

export interface FormState extends BookmarkFormData {}

export interface InsightInputProps {
  insights: string[];
  onInsightChange: (insights: string[]) => void;
}

export interface PersonalGrowthInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export interface SortOptions {
  date: 'asc' | 'desc';
  title: 'asc' | 'desc';
  credibility: 'asc' | 'desc';
}

export interface FilterOptions {
  tags: string[];
  collections: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ErrorState {
  message: string;
  code?: string;
  details?: unknown;
}

export interface SyncStatus {
  lastSync: Date | null;
  isPending: boolean;
  error: string | null;
}

export interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}

export interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export interface BookmarkListProps {
  bookmarks: Bookmark[];
}