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
  tags: string[];
  collections: string[];
  insights?: string[];
  categories?: string[];
  dateAdded: Date;
  userId: string;
  analysis?: {
    summary?: string;
    credibilityScore?: number;
  };
  metadata?: {
    visitCount: number;
  };
  syncStatus?: 'pending' | 'synced' | 'error';
}

export interface BookmarkFormData {
  url: string;
  title: string;
  description?: string;
  tags: string[];
  collections: string[];
  insights?: string[];
  categories?: string[];
  personalGrowthNotes?: string;
}

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