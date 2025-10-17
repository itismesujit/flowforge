import { useCallback } from 'react';
import { toaster } from '../components/ui/toaster';

interface ErrorOptions {
  title?: string;
  duration?: number;
  showToast?: boolean;
  logToConsole?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
}

/**
 * useErrorHandler - Centralized error handling hook
 */
export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | ApiError | string,
    options: ErrorOptions = {}
  ) => {
    const {
      title = 'Error',
      duration = 5000,
      showToast = true,
      logToConsole = true,
    } = options;

    let errorMessage: string;
    let errorDetails: any = null;

    // Parse different error types
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    } else if (typeof error === 'object' && error !== null) {
      // API Error
      const apiError = error as ApiError;
      errorMessage = apiError.message || 'An unexpected error occurred';
      errorDetails = {
        status: apiError.status,
        code: apiError.code,
        field: apiError.field,
      };
    } else {
      errorMessage = 'An unexpected error occurred';
    }

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error handled:', {
        message: errorMessage,
        details: errorDetails,
        originalError: error,
      });
    }

    // Show toast notification if enabled
    if (showToast) {
      toaster.create({
        title,
        description: errorMessage,
        type: 'error',
        duration,
      });
    }

    return {
      message: errorMessage,
      details: errorDetails,
    };
  }, []);

  const handleApiError = useCallback((error: any, options: ErrorOptions = {}) => {
    let apiError: ApiError;

    if (error?.response) {
      // Axios error with response
      const { status, data } = error.response;
      apiError = {
        message: data?.message || data?.error || 'Server error occurred',
        status,
        code: data?.code,
        field: data?.field,
      };
    } else if (error?.request) {
      // Network error
      apiError = {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else if (error?.message) {
      // Generic error
      apiError = {
        message: error.message,
      };
    } else {
      // Unknown error
      apiError = {
        message: 'An unexpected error occurred',
      };
    }

    return handleError(apiError, options);
  }, [handleError]);

  const handleValidationError = useCallback((errors: Record<string, string[]>, options: ErrorOptions = {}) => {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');

    return handleError(errorMessages, {
      title: 'Validation Error',
      ...options,
    });
  }, [handleError]);

  const handleAuthError = useCallback((error: any, options: ErrorOptions = {}) => {
    return handleApiError(error, {
      title: 'Authentication Error',
      ...options,
    });
  }, [handleApiError]);

  const handleWorkflowError = useCallback((error: any, options: ErrorOptions = {}) => {
    return handleApiError(error, {
      title: 'Workflow Error',
      ...options,
    });
  }, [handleApiError]);

  const handleExecutionError = useCallback((error: any, options: ErrorOptions = {}) => {
    return handleApiError(error, {
      title: 'Execution Error',
      ...options,
    });
  }, [handleApiError]);

  return {
    handleError,
    handleApiError,
    handleValidationError,
    handleAuthError,
    handleWorkflowError,
    handleExecutionError,
  };
};