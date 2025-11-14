import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', 500, details);
    this.name = 'NetworkError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'STORAGE_ERROR', 500, details);
    this.name = 'StorageError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTH_ERROR', 401, details);
    this.name = 'AuthError';
  }
}

export interface ErrorOptions {
  silent?: boolean;
  duration?: number;
  showDetails?: boolean;
  logToConsole?: boolean;
}

export function handleError(
  err: unknown, 
  context?: string,
  options: ErrorOptions = {}
): string {
  const {
    silent = false,
    duration = 4000,
    showDetails = import.meta.env.DEV,
    logToConsole = true
  } = options;

  let message = 'Terjadi kesalahan tidak terduga';
  let details: unknown;

  if (err instanceof AppError) {
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = String(err);
  }

  const fullMessage = context ? `${context}: ${message}` : message;
  if (logToConsole && (import.meta.env.DEV || showDetails)) {
    console.error('Error:', {
      context,
      message,
      details,
      error: err,
      stack: err instanceof Error ? err.stack : undefined
    });
  }
  if (!silent) {
    toast.error(fullMessage, {
      duration,
      description: showDetails && details ? String(details) : undefined,
    });
  }

  return fullMessage;
}

export function handleSuccess(message: string, description?: string, duration = 3000) {
  toast.success(message, { 
    description,
    duration,
  });
}

export function handleWarning(message: string, description?: string, duration = 4000) {
  toast.warning(message, { 
    description,
    duration,
  });
}

export function handleInfo(message: string, description?: string, duration = 3000) {
  toast.info(message, { 
    description,
    duration,
  });
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorContext?: string,
  options?: ErrorOptions
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, errorContext, options);
    return null;
  }
}

export function tryCatch<T>(
  fn: () => T,
  errorContext?: string,
  options?: ErrorOptions
): T | null {
  try {
    return fn();
  } catch (error) {
    handleError(error, errorContext, options);
    return null;
  }
}

export interface ErrorLog {
  timestamp: string;
  context?: string;
  message: string;
  error: unknown;
  userAgent?: string;
  url?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50;

  log(error: unknown, context?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      context,
      message: error instanceof Error ? error.message : String(error),
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.push(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorLog);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const errorLogger = new ErrorLogger();
const originalHandleError = handleError;
export function handleErrorWithLogging(
  err: unknown,
  context?: string,
  options?: ErrorOptions
): string {
  errorLogger.log(err, context);
  return originalHandleError(err, context, options);
}
