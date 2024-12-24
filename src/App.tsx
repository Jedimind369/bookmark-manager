import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Header } from './components/Header'
import BookmarkList from './components/BookmarkList'
import { ProtectedRoute } from './components/ProtectedRoute'
import { initializeAuth } from './store/authSlice'
import { ErrorBoundary } from './components/ErrorBoundary'
import { syncBookmarks } from './store/bookmarksSlice'
import { AppDispatch } from './store'
function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    const handleOnline = () => {
      dispatch(syncBookmarks())
    }
    
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [dispatch])

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <BookmarkList />
          </main>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  )
}

export default App