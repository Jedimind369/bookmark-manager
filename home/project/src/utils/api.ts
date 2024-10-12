// ... (existing imports and code)

export const upgradeToPremiun = async (): Promise<void> => {
  await api.post('/auth/upgrade');
};

// ... (rest of the existing code)