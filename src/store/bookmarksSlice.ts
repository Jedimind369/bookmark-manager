import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Bookmark, BookmarkFormData } from '../types'
import { analyzeContent } from '../services/ai'
import { NetworkError, handleApiError } from '../utils/errorHandling'
import { saveBookmarkOffline, deleteBookmarkOffline, getOfflineBookmarks, syncPendingChanges } from '../services/db'

interface BookmarksState {
  items: Bookmark[]
  loading: boolean
  error: string | null
  searchQuery: string
  filteredItems: Bookmark[]
  selectedTags: string[]
  sortBy: 'date' | 'title' | 'credibility'
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  filteredItems: [],
  selectedTags: [],
  sortBy: 'date'
}

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bookmark[]
    } catch (error) {
      return rejectWithValue('Failed to fetch bookmarks')
    }
  }
)

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async ({ bookmark, userId }: { bookmark: BookmarkFormData; userId: string }, { rejectWithValue }) => {
    try {
      let analysis
      if (navigator.onLine) {
        analysis = await analyzeContent(bookmark.url)
      }

      const newBookmark = {
        id: '',
        ...bookmark,
        userId,
        dateAdded: new Date(),
        analysis: analysis || {
          summary: '',
          keyInsights: [],
          credibilityScore: 0,
          readingTime: 0
        }
      } as unknown as Bookmark

      if (navigator.onLine) {
        const docRef = await addDoc(collection(db, 'bookmarks'), {
          ...newBookmark,
          dateAdded: newBookmark.dateAdded.toISOString()
        })
        newBookmark.id = docRef.id
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
      await deleteDoc(doc(db, 'bookmarks', id))
      return id
    } catch (error) {
      return rejectWithValue('Failed to delete bookmark')
    }
  }
)

export const syncBookmarks = createAsyncThunk(
  'bookmarks/syncBookmarks',
  async (_, { dispatch }) => {
    if (navigator.onLine) {
      await syncPendingChanges()
      const offlineBookmarks = await getOfflineBookmarks()
      return offlineBookmarks
    }
    return []
  }
)

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    searchBookmarks: (state, action) => {
      state.searchQuery = action.payload
      const query = action.payload.toLowerCase()
      state.filteredItems = state.items.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query)) ||
        bookmark.analysis?.summary.toLowerCase().includes(query)
      )
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter(t => t !== tag)
      } else {
        state.selectedTags.push(tag)
      }
      // Reapply filtering
      state.filteredItems = filterBookmarks(state.items, state.searchQuery, state.selectedTags)
    },
    setSortBy: (state, action: PayloadAction<'date' | 'title' | 'credibility'>) => {
      state.sortBy = action.payload
      state.filteredItems = sortBookmarks(state.filteredItems, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Add bookmark
      .addCase(addBookmark.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete bookmark
      .addCase(deleteBookmark.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

function filterBookmarks(items: Bookmark[], query: string, tags: string[]): Bookmark[] {
  return items.filter(bookmark => {
    const matchesSearch = !query || 
      bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      bookmark.analysis?.summary.toLowerCase().includes(query.toLowerCase())

    const matchesTags = tags.length === 0 || 
      tags.every(tag => bookmark.tags.includes(tag))

    return matchesSearch && matchesTags
  })
}

function sortBookmarks(items: Bookmark[], sortBy: 'date' | 'title' | 'credibility'): Bookmark[] {
  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'credibility':
        return (b.analysis?.credibilityScore || 0) - (a.analysis?.credibilityScore || 0)
      default:
        return 0
    }
  })
}

export const { searchBookmarks, toggleTag, setSortBy } = bookmarksSlice.actions
export default bookmarksSlice.reducer 