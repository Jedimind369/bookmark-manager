/**
 * @module AIService
 * @description Handles AI interactions and logging
 */

import OpenAI from 'openai';
import { NetworkError, ContentError } from '../utils/errorHandling';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AIInteraction {
  prompt: string;
  result: string;
  timestamp: Date;
  component: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface AIAnalysisResult {
  summary: string;
  tags: string[];
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

class AIService {
  private static instance: AIService;
  private interactions: AIInteraction[] = [];
  private readonly MAX_LOG_SIZE = 1000;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public logInteraction(interaction: AIInteraction): void {
    this.interactions.push({
      ...interaction,
      timestamp: new Date()
    });

    if (this.interactions.length > this.MAX_LOG_SIZE) {
      this.interactions = this.interactions.slice(-this.MAX_LOG_SIZE);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[AI Log] ${interaction.component}: ${interaction.prompt.slice(0, 100)}...`);
    }
  }

  public async analyzeContent(url: string, content: string): Promise<AIAnalysisResult> {
    const interaction: AIInteraction = {
      prompt: `Analyze content from ${url}`,
      result: '',
      timestamp: new Date(),
      component: 'ContentAnalyzer',
      metadata: { url }
    };

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Analyze the webpage content and return a JSON object with:
              {
                "summary": "Brief summary under 200 chars",
                "tags": ["relevant", "tags"],
                "category": "main category",
                "sentiment": "positive" | "neutral" | "negative"
              }`
          },
          {
            role: "user",
            content: `URL: ${url}\n\nContent: ${content.slice(0, 4000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const result = this.safeJSONParse<AIAnalysisResult>(completion.choices[0].message.content);
      if (!result.summary) {
        throw new ContentError('Failed to analyze content');
      }

      interaction.result = JSON.stringify(result);
      this.logInteraction(interaction);

      return result;
    } catch (error) {
      interaction.result = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logInteraction(interaction);
      throw error instanceof NetworkError || error instanceof ContentError
        ? error
        : new Error('Failed to analyze content');
    }
  }

  private safeJSONParse<T>(str: string | null | undefined): T {
    if (!str) return {} as T;
    try {
      return JSON.parse(str) as T;
    } catch {
      return {} as T;
    }
  }

  public getRecentInteractions(component: string, limit = 10): AIInteraction[] {
    return this.interactions
      .filter(i => i.component === component)
      .slice(-limit);
  }

  public clearInteractions(): void {
    this.interactions = [];
  }

  public exportInteractions(): string {
    return JSON.stringify(this.interactions, null, 2);
  }
}

export const aiService = AIService.getInstance();
export default aiService; 