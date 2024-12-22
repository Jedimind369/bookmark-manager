import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Bookmark, BookmarkFormData } from '../types'

interface BookmarksState {
  items: Bookmark[]
  loading: boolean
  error: string | null
  searchQuery: string
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: ''
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
      const docRef = await addDoc(collection(db, 'bookmarks'), {
        ...bookmark,
        userId,
        dateAdded: new Date().toISOString()
      })
      return {
        id: docRef.id,
        ...bookmark,
        dateAdded: new Date()
      } as Bookmark
    } catch (error) {
      return rejectWithValue('Failed to add bookmark')
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

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    searchBookmarks: (state, action) => {
      state.searchQuery = action.payload
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

export const { searchBookmarks } = bookmarksSlice.actions
export default bookmarksSlice.reducer 