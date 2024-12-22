import { auth } from '../../config/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';

export const authService = {
  signIn: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  },

  signOut: () => firebaseSignOut(auth),

  getCurrentUser: () => auth.currentUser
}; 