
import { User } from '../types';

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch('/__replauthuser');
      const data = await response.json();
      if (!data.id) return null;
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.profileImage
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  login: async () => {
    window.location.href = '/__replauthlogin';
  },

  logout: async () => {
    window.location.href = '/__replauthlogout';
  }
};
