
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../types';
import { getBookmarksFromDB, addBookmarkToDB, deleteBookmarkFromDB } from '../services/db';

interface BookmarksState {
  items: Bookmark[];
  loading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
  syncStatus: 'idle'
};

export const syncBookmarks = createAsyncThunk(
  'bookmarks/sync',
  async (userId: string) => {
    const bookmarks = await getBookmarksFromDB(userId);
    return bookmarks;
  }
);

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.items.push(action.payload);
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(bookmark => bookmark.id !== action.payload);
    },
    setSyncStatus: (state, action: PayloadAction<BookmarksState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
  searchBookmarks: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      if (!query) return;
      state.items = state.items.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(syncBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sync bookmarks';
      });
  }
});

export const { addBookmark, removeBookmark, setSyncStatus, searchBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
