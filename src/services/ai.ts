
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateTags = async (content: string): Promise<string[]> => {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
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
      }],
    });

    const suggestions = response.choices[0].message.content;
    return suggestions?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
}
