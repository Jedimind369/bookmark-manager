import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bookmarksReducer from './bookmarksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmarks: bookmarksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch