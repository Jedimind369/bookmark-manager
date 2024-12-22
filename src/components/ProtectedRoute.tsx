import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Login } from './Login'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSelector((state: RootState) => state.auth)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return <>{children}</>
} 