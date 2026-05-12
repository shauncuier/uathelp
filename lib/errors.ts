/**
 * Error handling and logging utilities
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  DATABASE = 'DATABASE',
  EXTERNAL_API = 'EXTERNAL_API',
  RATE_LIMIT = 'RATE_LIMIT',
}

export interface ErrorContext {
  userId?: string;
  action?: string;
  resource?: string;
  details?: Record<string, any>;
  statusCode?: number;
  timestamp?: Date;
  [key: string]: any; // Allow additional properties
}

export class AppError extends Error {
  constructor(
    public message: string,
    public type: ErrorType,
    public statusCode: number,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.message,
      type: this.type,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Log error to console and optionally to a service
 */
export function logError(error: Error | AppError, context?: ErrorContext) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError && {
      type: error.type,
      statusCode: error.statusCode,
      context: error.context,
    }),
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorInfo);
  }

  // Log to external service in production (e.g., Sentry, LogRocket)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service
    console.error('Error:', errorInfo);
  }

  return errorInfo;
}

/**
 * Handle validation errors
 */
export function createValidationError(
  message: string,
  context?: ErrorContext
): AppError {
  return new AppError(
    message,
    ErrorType.VALIDATION,
    400,
    context
  );
}

/**
 * Handle authentication errors
 */
export function createAuthenticationError(
  message: string = 'Authentication required',
  context?: ErrorContext
): AppError {
  return new AppError(
    message,
    ErrorType.AUTHENTICATION,
    401,
    context
  );
}

/**
 * Handle authorization errors
 */
export function createAuthorizationError(
  message: string = 'You do not have permission to access this resource',
  context?: ErrorContext
): AppError {
  return new AppError(
    message,
    ErrorType.AUTHORIZATION,
    403,
    context
  );
}

/**
 * Handle not found errors
 */
export function createNotFoundError(
  resource: string,
  context?: ErrorContext
): AppError {
  return new AppError(
    `${resource} not found`,
    ErrorType.NOT_FOUND,
    404,
    { ...context, resource }
  );
}

/**
 * Handle conflict errors
 */
export function createConflictError(
  message: string,
  context?: ErrorContext
): AppError {
  return new AppError(
    message,
    ErrorType.CONFLICT,
    409,
    context
  );
}

/**
 * Handle internal server errors
 */
export function createInternalError(
  message: string = 'An internal server error occurred',
  context?: ErrorContext
): AppError {
  return new AppError(
    message,
    ErrorType.INTERNAL_SERVER,
    500,
    context
  );
}

/**
 * Handle database errors
 */
export function createDatabaseError(
  message: string,
  context?: ErrorContext
): AppError {
  return new AppError(
    'A database error occurred',
    ErrorType.DATABASE,
    500,
    { ...context, originalMessage: message }
  );
}

/**
 * Handle rate limit errors
 */
export function createRateLimitError(
  retryAfter: number,
  context?: ErrorContext
): AppError {
  return new AppError(
    `Too many requests. Please retry after ${retryAfter} seconds`,
    ErrorType.RATE_LIMIT,
    429,
    { ...context, retryAfter }
  );
}

/**
 * Handle external API errors
 */
export function createExternalApiError(
  service: string,
  message: string,
  context?: ErrorContext
): AppError {
  return new AppError(
    `External service error: ${service}`,
    ErrorType.EXTERNAL_API,
    502,
    { ...context, service, originalMessage: message }
  );
}

/**
 * Convert error to API response
 */
export function errorToResponse(error: Error | AppError) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: error.toJSON(),
    };
  }

  // Unknown error
  return {
    statusCode: 500,
    body: {
      error: 'An unexpected error occurred',
      type: ErrorType.INTERNAL_SERVER,
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Safe error handler for API routes
 */
export function handleApiError(error: any) {
  logError(error);

  if (error instanceof AppError) {
    return error.toJSON();
  }

  if (error.name === 'ZodError') {
    return {
      error: 'Validation failed',
      type: ErrorType.VALIDATION,
      statusCode: 400,
      issues: error.issues,
    };
  }

  return {
    error: 'An unexpected error occurred',
    type: ErrorType.INTERNAL_SERVER,
    statusCode: 500,
  };
}
