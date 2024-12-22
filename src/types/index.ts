export interface Bookmark {
  id: string
  url: string
  title: string
  description?: string
  tags: string[]
  dateAdded: Date
  favicon?: string
}

export interface BookmarkFormData {
  url: string
  title: string
  description?: string
  tags: string[]
} 