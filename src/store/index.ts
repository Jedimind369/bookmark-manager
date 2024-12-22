import { configureStore } from '@reduxjs/toolkit'
import bookmarksReducer from './bookmarksSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 