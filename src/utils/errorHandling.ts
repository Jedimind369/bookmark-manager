export class NetworkError extends Error {
  public readonly statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'NetworkError'
    this.statusCode = statusCode
    // Restore prototype chain
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
    // Restore prototype chain
    Object.setPrototypeOf(this, ContentError.prototype)
  }
}

export class ApiError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'ApiError'
    // Restore prototype chain
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof NetworkError) {
    return `Network error: ${error.message}${error.statusCode ? ` (${error.statusCode})` : ''}`
  }
  if (error instanceof ContentError) {
    return `Content error: ${error.message}`
  }
  if (error instanceof ApiError) {
    return `API error: ${error.message} (${error.code})`
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

export function isContentError(error: unknown): error is ContentError {
  return error instanceof ContentError
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
} 