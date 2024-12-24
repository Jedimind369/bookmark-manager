
export const convertToMarkdown = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    const result = await response.json();
    return result.markdown;
  } catch (error) {
    console.error('Error converting file:', error);
    throw error;
  }
};
