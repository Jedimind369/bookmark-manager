
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const generateTags = async (content: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Generate relevant tags for this bookmark content. Return as comma-separated values."
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
