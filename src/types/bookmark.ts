
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
