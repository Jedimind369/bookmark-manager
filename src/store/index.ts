import { configureStore, Middleware, Action, AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import bookmarksReducer from './bookmarksSlice'
import authReducer from './authSlice'

type State = {
  bookmarks: ReturnType<typeof bookmarksReducer>
  auth: ReturnType<typeof authReducer>
}

// Custom middleware to handle errors
const errorHandlingMiddleware: Middleware<unknown, State> = 
  (store) => (next) => (action) => {
    try {
      return next(action)
    } catch (error) {
      console.error('Redux error:', error)
      throw error
    }
  }

// Custom middleware to handle offline actions
const offlineMiddleware: Middleware<unknown, State> = 
  (store) => (next) => (action) => {
    if (typeof action === 'object' && action !== null && 'type' in action) {
      const actionType = (action as Action).type
      if (!navigator.onLine && actionType.startsWith('bookmarks/')) {
        // Store offline actions in IndexedDB
        console.log('Storing offline action:', action)
      }
    }
    return next(action)
  }

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['bookmarks/addBookmark/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.dateAdded'],
        // Ignore these paths in the state
        ignoredPaths: ['bookmarks.items.dateAdded']
      }
    }).concat([errorHandlingMiddleware, offlineMiddleware])
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// Export hooks that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector