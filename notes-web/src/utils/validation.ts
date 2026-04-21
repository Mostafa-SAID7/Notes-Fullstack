import type { ApiError } from '../services/api';

/**
 * Extract validation errors from API error response
 * @param error - API error object
 * @returns Validation errors or null
 */
export const extractValidationErrors = (error: ApiError): Record<string, string[]> | null => {
  return error.errors || null;
};

/**
 * Check if error is a validation error
 * @param error - API error object
 * @returns True if error contains validation errors
 */
export const isValidationError = (error: ApiError): boolean => {
  return error.statusCode === 400 && !!error.errors;
};
