import { useDispatch } from 'react-redux'
import { signInWithGoogle } from '../store/authSlice'
import { AppDispatch } from '../store'

export function Login() {
  const dispatch = useDispatch<AppDispatch>()

  const handleSignIn = async () => {
    try {
      await dispatch(signInWithGoogle())
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold dark:text-white">Sign in to Bookmark Manager</h2>
        <button
          onClick={handleSignIn}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
} 