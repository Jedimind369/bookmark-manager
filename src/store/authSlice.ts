import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'
import type { User } from '../types'

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    if (!result.user.email) {
      throw new Error('Email is required')
    }
    return {
      id: result.user.uid,
      email: result.user.email,
      uid: result.user.uid
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
  user: User | null
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
    return new Promise<User | null>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email) {
          resolve({
            id: user.uid,
            email: user.email,
            uid: user.uid
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