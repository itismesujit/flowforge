/**
 * Error handling utilities and types
 */

export interface AppError {
  name: string;
  message: string;
  code?: string;
  status?: number;
  field?: string;
  timestamp: string;
  stack?: string;
}

export class ValidationError extends Error {
  public field: string;
  public code: string;

  constructor(message: string, field: string, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class NetworkError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status: number = 0) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.code = 'NETWORK_ERROR';
  }
}

export class AuthenticationError extends Error {
  public code: string;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.code = 'AUTH_ERROR';
  }
}

export class AuthorizationError extends Error {
  public code: string;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.code = 'AUTHORIZATION_ERROR';
  }
}

/**
 * Convert any error to AppError format
 */
export const normalizeError = (error: any): AppError => {
  const timestamp = new Date().toISOString();

  if (error instanceof ValidationError) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      field: error.field,
      timestamp,
      stack: error.stack,
    };
  }

  if (error instanceof NetworkError) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status,
      timestamp,
      stack: error.stack,
    };
  }

  if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      timestamp,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      timestamp,
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
      timestamp,
    };
  }

  // Handle API errors
  if (error?.response) {
    const { status, data } = error.response;
    return {
      name: 'ApiError',
      message: data?.message || data?.error || 'API request failed',
      code: data?.code,
      status,
      field: data?.field,
      timestamp,
    };
  }

  return {
    name: 'UnknownError',
    message: 'An unknown error occurred',
    timestamp,
  };
};

/**
 * Check if error is retryable (network issues, server errors)
 */
export const isRetryableError = (error: AppError): boolean => {
  // Network errors are usually retryable
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return true;
  }

  // 5xx server errors are retryable
  if (error.status && error.status >= 500 && error.status < 600) {
    return true;
  }

  // Rate limiting might be retryable
  if (error.status === 429) {
    return true;
  }

  // Timeout errors
  if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
    return true;
  }

  return false;
};