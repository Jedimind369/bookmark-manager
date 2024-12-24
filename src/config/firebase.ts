
// Using Replit Auth instead of Firebase
export const auth = {
  getCurrentUser: async () => {
    const response = await fetch('/__replauthuser');
    return response.json();
  }
};
