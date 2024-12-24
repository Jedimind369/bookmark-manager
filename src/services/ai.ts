import OpenAI from 'openai';
import { NetworkError, ContentError } from '../utils/errorHandling';
import type { Bookmark } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ContentAnalysis {
  summary: string;
  keyInsights: string[];
  credibilityScore: number;
  readingTime: number;
  suggestedTags: string[];
}

interface AIResponse {
  summary: string;
  keyInsights: string[];
  credibilityScore: number;
  readingTime: number;
  suggestedTags: string[];
}

export async function analyzeContent(url: string): Promise<ContentAnalysis> {
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
    const response = await fetchWithRetry(proxyUrl)
    const html = await response.text()
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const content = extractMainContent(html)
    const { title, description } = extractMetadata(doc)
    
    if (!content) {
      throw new ContentError('No content found on page')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the webpage content and return a JSON object with:
            {
              "summary": "Brief summary under 200 chars",
              "keyInsights": ["key point 1", "key point 2"],
              "credibilityScore": number between 0-100,
              "readingTime": estimated reading time in minutes,
              "suggestedTags": ["tag1", "tag2"]
            }`
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}\n\nContent: ${content.slice(0, 4000)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const result = safeJSONParse<AIResponse>(completion.choices[0].message.content)
    if (!result.summary) {
      throw new ContentError('Failed to analyze content')
    }

    return {
      summary: result.summary,
      keyInsights: result.keyInsights || [],
      credibilityScore: result.credibilityScore || 0,
      readingTime: result.readingTime || 0,
      suggestedTags: result.suggestedTags || []
    }
  } catch (error) {
    console.error('Content analysis failed:', error)
    throw error instanceof NetworkError || error instanceof ContentError
      ? error
      : new Error('Failed to analyze content')
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new NetworkError(
          `Failed to fetch content: ${response.statusText}`,
          response.status
        )
      }
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  throw new NetworkError('Failed to fetch after retries')
}

function safeJSONParse<T>(str: string | null | undefined): T {
  if (!str) return {} as T
  try {
    return JSON.parse(str) as T
  } catch {
    return {} as T
  }
}

interface ContentElement {
  textContent: string | null;
  remove: () => void;
}

function extractMainContent(html: string): string {
  if (!html) {
    return '';
  }
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Remove unwanted elements
  const selectorsToRemove = [
    'script', 'style', 'nav', 'footer', 'header', 'aside',
    '[role="banner"]', '[role="navigation"]', '[role="complementary"]',
    '.ads', '.advertisement', '.social-share', '.comments',
    '#comments', '.sidebar', '.footer', '.header'
  ]
  
  doc.querySelectorAll(selectorsToRemove.join(',')).forEach(el => el.remove())
  
  // Try to find main content in priority order
  const mainSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    '#content',
    '.main',
    '.body'
  ]
  
  for (const selector of mainSelectors) {
    const element = doc.querySelector(selector)
    if (element?.textContent) {
      return cleanContent(element.textContent)
    }
  }
  
  // Fallback: Try to find the largest text block
  const paragraphs = Array.from(doc.querySelectorAll('p'))
  if (paragraphs.length > 0) {
    const mainContent = paragraphs
      .filter(p => (p.textContent || '').length > 50) // Filter out short paragraphs
      .map(p => p.textContent || '')
      .join('\n\n')
    
    return cleanContent(mainContent)
  }
  
  // Last resort: Use body content
  return cleanContent(doc.body.textContent || '')
}

function cleanContent(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
    .replace(/[^\S\n]+/g, ' ') // Replace multiple spaces (except newlines) with single space
    .trim()
}

function extractMetadata(doc: Document): { title: string; description: string } {
  const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
    doc.title ||
    ''

  const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
    ''

  return { title, description }
}

export async function suggestCollections(bookmarks: Bookmark[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: "Analyze bookmarks and suggest meaningful collections based on personal growth categories."
    }, {
      role: "user",
      content: JSON.stringify(bookmarks)
    }],
    temperature: 0.7,
  });

  const suggestions = response.choices[0].message.content
  return suggestions?.split(',').map(tag => tag.trim()).filter(Boolean) || []
} 