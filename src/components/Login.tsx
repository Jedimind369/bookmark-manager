import { useDispatch } from 'react-redux'
import { signInWithGoogle } from '../store/authSlice'

export function Login() {
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Sign in to Bookmark Manager</h2>
        <button
          onClick={() => dispatch(signInWithGoogle())}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
} 