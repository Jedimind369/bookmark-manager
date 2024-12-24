import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export const generateTags = async (content: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn('OpenAI API key not found. Tag generation disabled.');
    return [];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Generate 3-5 relevant tags for the following content. Return only comma-separated tags."
      }, {
        role: "user",
        content
      }]
    });

    const suggestions = response.choices[0].message.content;
    return suggestions?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
};

export const analyzeContent = async (content: string): Promise<string> => {
  if (!apiKey) return '';
  // Implementation here
  return content;
};