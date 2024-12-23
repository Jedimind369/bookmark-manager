export interface Bookmark {
  id: string
  url: string
  title: string
  description?: string
  tags: string[]
  dateAdded: Date
  favicon?: string
  analysis?: {
    summary: string
    keyInsights: string[]
    credibilityScore: number
    readingTime: number
  }
  collections: string[]
  personalNotes?: string
  lastAccessed?: Date
}

export interface Collection {
  id: string
  name: string
  description: string
  bookmarks: string[]
  color?: string
  icon?: string
  isPublic: boolean
  collaborators?: string[]
}

export interface BookmarkFormData {
  url: string
  title: string
  description?: string
  tags: string[]
} 