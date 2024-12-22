import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return {
      id: result.user.uid,
      email: result.user.email
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    await firebaseSignOut(auth)
  }
)

interface AuthState {
  user: null | { id: string; email: string }
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({
            id: user.uid,
            email: user.email
          })
        } else {
          resolve(null)
        }
      })
    })
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
      })
  }
})

export default authSlice.reducer 