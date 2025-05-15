/**
 * Extended error types for application error handling
 */

/**
 * API Error interface that extends the standard Error with additional properties
 * This allows us to add context to errors in a type-safe way
 */
export interface ApiErrorDetails {
  code: number | string;
  isApiError: boolean;
  details?: unknown;
}

/**
 * Checks if an error has API error details
 */
export function isApiErrorWithDetails(error: Error): error is Error & ApiErrorDetails {
  return (
    error instanceof Error && 
    'code' in error && 
    'isApiError' in error
  );
}

/**
 * Gets API error details from an error object in a type-safe way
 * If the error doesn't have API details, returns default values
 */
export function getApiErrorDetails(error: Error): ApiErrorDetails {
  if (isApiErrorWithDetails(error)) {
    return {
      code: error.code,
      isApiError: error.isApiError,
      details: 'details' in error ? error.details : undefined
    };
  }
  
  return {
    code: 'UNKNOWN',
    isApiError: false
  };
}
