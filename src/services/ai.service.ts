/**
 * @module AIService
 * @description Handles AI interactions and logging
 */

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

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Logs an AI interaction
   * @param {AIInteraction} interaction - The interaction to log
   */
  public logInteraction(interaction: AIInteraction): void {
    this.interactions.push({
      ...interaction,
      timestamp: new Date()
    });

    // Trim logs if they exceed max size
    if (this.interactions.length > this.MAX_LOG_SIZE) {
      this.interactions = this.interactions.slice(-this.MAX_LOG_SIZE);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[AI Log] ${interaction.component}: ${interaction.prompt.slice(0, 100)}...`
      );
    }
  }

  /**
   * Gets recent interactions for a component
   * @param {string} component - The component name
   * @param {number} limit - Maximum number of interactions to return
   */
  public getRecentInteractions(component: string, limit = 10): AIInteraction[] {
    return this.interactions
      .filter(i => i.component === component)
      .slice(-limit);
  }

  /**
   * Clears all logged interactions
   */
  public clearInteractions(): void {
    this.interactions = [];
  }

  /**
   * Exports interactions to JSON
   */
  public exportInteractions(): string {
    return JSON.stringify(this.interactions, null, 2);
  }

  /**
   * Analyzes content using AI
   * @param {string} url - The URL to analyze
   * @param {string} content - The content to analyze
   */
  public async analyzeContent(
    url: string,
    content: string
  ): Promise<AIAnalysisResult> {
    const interaction: AIInteraction = {
      prompt: `Analyze content from ${url}`,
      result: '',
      timestamp: new Date(),
      component: 'ContentAnalyzer',
      metadata: { url }
    };

    try {
      // TODO: Implement actual OpenAI integration
      const result: AIAnalysisResult = {
        summary: 'Content summary placeholder',
        tags: ['tag1', 'tag2'],
        category: 'uncategorized',
        sentiment: 'neutral'
      };

      interaction.result = JSON.stringify(result);
      this.logInteraction(interaction);

      return result;
    } catch (error) {
      interaction.result = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logInteraction(interaction);
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();
export default aiService; 