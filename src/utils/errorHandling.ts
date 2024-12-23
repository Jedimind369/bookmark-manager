export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof NetworkError) {
    return `Network error: ${error.message}${error.statusCode ? ` (${error.statusCode})` : ''}`
  }
  if (error instanceof ContentError) {
    return `Content error: ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
} 