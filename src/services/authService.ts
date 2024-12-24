
export const authService = {
  signIn: async () => {
    window.location.href = '/__repl/auth/login';
  },

  signOut: async () => {
    window.location.href = '/__repl/auth/logout';
  },

  getCurrentUser: async () => {
    const response = await fetch('/__replauthuser');
    return response.json();
  }
};
