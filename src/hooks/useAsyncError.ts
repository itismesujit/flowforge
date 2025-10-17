import { useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

/**
 * useAsyncError - Hook for throwing errors that can be caught by ErrorBoundary
 */
export const useAsyncError = () => {
  const { handleError } = useErrorHandler();

  const throwError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Log the error first
    handleError(errorObj, { showToast: false });
    
    // Throw the error to be caught by ErrorBoundary
    throw errorObj;
  }, [handleError]);

  return throwError;
};

/**
 * useRetry - Hook for retry functionality with exponential backoff
 */
export const useRetry = () => {
  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const backoffDelay = delay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }

    throw lastError!;
  }, []);

  return retry;
};