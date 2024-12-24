import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, DocumentData, writeBatch } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Bookmark, BookmarkFormData } from '../types'
import { analyzeContent } from '../services/ai'
import { handleApiError, ApiError } from '../utils/errorHandling'
import { saveBookmarkOffline, deleteBookmarkOffline, getOfflineBookmarks, syncPendingChanges } from '../services/db'

interface BookmarksState {
  items: Bookmark[]
  loading: boolean
  error: string | null
  searchQuery: string
  filteredItems: Bookmark[]
  selectedTags: string[]
  sortBy: 'date' | 'title' | 'credibility'
  isSyncing: boolean
  lastSyncTime: string | null
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  filteredItems: [],
  selectedTags: [],
  sortBy: 'date',
  isSyncing: false,
  lastSyncTime: null
}

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Get online bookmarks
      const q = query(collection(db, 'bookmarks'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const onlineBookmarks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: new Date((doc.data() as DocumentData).dateAdded)
      })) as Bookmark[]

      // Get offline bookmarks
      const offlineBookmarks = await getOfflineBookmarks()

      // Merge bookmarks, preferring online versions
      const bookmarkMap = new Map<string, Bookmark>()
      offlineBookmarks.forEach(bookmark => bookmarkMap.set(bookmark.id, bookmark))
      onlineBookmarks.forEach(bookmark => bookmarkMap.set(bookmark.id, bookmark))

      return Array.from(bookmarkMap.values())
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async ({ bookmark, userId }: { bookmark: BookmarkFormData; userId: string }, { rejectWithValue }) => {
    try {
      let analysis
      if (navigator.onLine) {
        try {
          analysis = await analyzeContent(bookmark.url)
        } catch (error) {
          console.warn('Failed to analyze content:', error)
        }
      }

      const newBookmark: Bookmark = {
        id: '',
        ...bookmark,
        userId,
        dateAdded: new Date(),
        collections: bookmark.collections || [],
        tags: bookmark.tags || [],
        analysis: analysis || {
          summary: '',
          keyInsights: [],
          credibilityScore: 0,
          readingTime: 0
        }
      }

      if (navigator.onLine) {
        try {
          const docRef = await addDoc(collection(db, 'bookmarks'), {
            ...newBookmark,
            dateAdded: newBookmark.dateAdded.toISOString()
          })
          newBookmark.id = docRef.id
        } catch (error) {
          console.warn('Failed to save online, falling back to offline storage:', error)
          newBookmark.id = `offline-${Date.now()}`
          await saveBookmarkOffline(newBookmark)
        }
      } else {
        newBookmark.id = `offline-${Date.now()}`
        await saveBookmarkOffline(newBookmark)
      }

      return newBookmark
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const deleteBookmark = createAsyncThunk(
  'bookmarks/deleteBookmark',
  async (id: string, { rejectWithValue }) => {
    try {
      if (navigator.onLine && !id.startsWith('offline-')) {
        try {
          await deleteDoc(doc(db, 'bookmarks', id))
        } catch (error) {
          console.warn('Failed to delete online, falling back to offline storage:', error)
          await deleteBookmarkOffline(id)
        }
      } else {
        await deleteBookmarkOffline(id)
      }
      return id
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const syncBookmarks = createAsyncThunk(
  'bookmarks/syncBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      if (navigator.onLine) {
        await syncPendingChanges()
        const offlineBookmarks = await getOfflineBookmarks()
        return {
          bookmarks: offlineBookmarks,
          timestamp: new Date().toISOString()
        }
      }
      return {
        bookmarks: [],
        timestamp: null
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    searchBookmarks: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredItems = filterBookmarks(state.items, action.payload, state.selectedTags)
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter(t => t !== tag)
      } else {
        state.selectedTags.push(tag)
      }
      state.filteredItems = filterBookmarks(state.items, state.searchQuery, state.selectedTags)
    },
    setSortBy: (state, action: PayloadAction<'date' | 'title' | 'credibility'>) => {
      state.sortBy = action.payload
      state.filteredItems = sortBookmarks(state.filteredItems, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = filterBookmarks(action.payload, state.searchQuery, state.selectedTags)
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addBookmark.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
        state.filteredItems = filterBookmarks(state.items, state.searchQuery, state.selectedTags)
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteBookmark.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.id !== action.payload)
        state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload)
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(syncBookmarks.pending, (state) => {
        state.isSyncing = true
        state.error = null
      })
      .addCase(syncBookmarks.fulfilled, (state, action) => {
        state.isSyncing = false
        state.lastSyncTime = action.payload?.timestamp ?? null
        if (action.payload?.bookmarks?.length > 0) {
          state.items = action.payload.bookmarks
          state.filteredItems = filterBookmarks(action.payload.bookmarks, state.searchQuery, state.selectedTags)
        }
      })
      .addCase(syncBookmarks.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload instanceof ApiError 
          ? action.payload.message 
          : typeof action.payload === 'string' 
            ? action.payload 
            : 'An unknown error occurred';
        state.lastSyncTime = null;
      })
  }
})

function filterBookmarks(items: Bookmark[], query: string, tags: string[]): Bookmark[] {
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean)
  
  return items.filter(bookmark => {
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => 
      bookmark.title.toLowerCase().includes(term) ||
      bookmark.description?.toLowerCase().includes(term) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(term)) ||
      bookmark.analysis?.summary?.toLowerCase().includes(term) || false
    )

    const matchesTags = tags.length === 0 || 
      tags.every(tag => bookmark.tags.includes(tag))

    return matchesSearch && matchesTags
  })
}

function sortBookmarks(items: Bookmark[], sortBy: 'date' | 'title' | 'credibility'): Bookmark[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.dateAdded.getTime() - a.dateAdded.getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'credibility':
        const aScore = a.analysis?.credibilityScore ?? 0
        const bScore = b.analysis?.credibilityScore ?? 0
        return bScore - aScore
      default:
        return 0
    }
  })
}

export const { searchBookmarks, toggleTag, setSortBy } = bookmarksSlice.actions
export default bookmarksSlice.reducer