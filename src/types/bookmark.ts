export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  category?: string;
  favicon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
} 