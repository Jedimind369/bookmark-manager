import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Header } from './components/Header'
import { BookmarkList } from './components/BookmarkList'
import { ProtectedRoute } from './components/ProtectedRoute'
import { initializeAuth } from './store/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <BookmarkList />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default App