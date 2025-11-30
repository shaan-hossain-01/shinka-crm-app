import { UserValidationError } from '../db/models/user.model';

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, string>;
}

/**
 * Get a unique error field name/message from a database error
 * Handles PostgreSQL unique constraint violations (error code 23505)
 */
const getUniqueErrorMessage = (err: any): string => {
  let output: string;
  
  try {
    // PostgreSQL unique constraint error code is '23505'
    // Extract field name from the error detail or constraint name
    let fieldName = 'field';
    
    if (err.detail) {
      // Try to extract from detail: "Key (email)=(test@test.com) already exists."
      const fieldMatch = err.detail.match(/Key \((\w+)\)=/);
      if (fieldMatch) {
        fieldName = fieldMatch[1];
      }
    } else if (err.constraint) {
      // Try to extract from constraint name: "users_email_unique"
      const constraintMatch = err.constraint.match(/(\w+)_unique/);
      if (constraintMatch) {
        fieldName = constraintMatch[1];
      }
    }
    
    // Capitalize first letter and add message
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
};

/**
 * Get the error message from validation errors
 */
const getValidationErrorMessage = (err: UserValidationError): string => {
  let message = '';
  const errors = err.errors;

  for (const errName in errors) {
    if (errors[errName]) {
      message = errors[errName];
      break;
    }
  }

  return message || 'Validation failed';
};

/**
 * Parse database errors and return readable error messages
 * 
 * Handles:
 * - Validation errors (from UserValidationError)
 * - Database constraint errors (unique, not null, etc.)
 * - Other database errors
 */
export const getErrorMessage = (err: any): string => {
  let message = '';

  // Handle errors with error codes (database errors)
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique constraint violation
        message = getUniqueErrorMessage(err);
        break;
      case '23502': // Not null violation
        message = 'Required field is missing';
        break;
      case '23503': // Foreign key violation
        message = 'Referenced record does not exist';
        break;
      case '22P02': // Invalid text representation
        message = 'Invalid data format';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    if (err instanceof UserValidationError) {
      message = getValidationErrorMessage(err);
    } else if (err.errors) {
      // Handle other validation error formats
      for (const errName in err.errors) {
        if (err.errors[errName].message) {
          message = err.errors[errName].message;
          break;
        }
      }
    } else if (err.message) {
      message = err.message;
    } else {
      message = 'Something went wrong';
    }
  }

  return message;
};

/**
 * Format error response for API responses
 * Returns a standardized error object
 */
export const formatErrorResponse = (err: any, statusCode: number = 500) => {
  const message = getErrorMessage(err);
  
  return {
    success: false,
    status: statusCode,
    message: message,
  };
};


// export default { getErrorMessage }
export default {
  getErrorMessage,
  formatErrorResponse,
};
