
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorTypes = {
  VALIDATION_ERROR: (message) => new AppError(message, 400),
  INVALID_INPUT: (field) => new AppError(`Invalid input for field: ${field}`, 400),
  MISSING_FIELD: (field) => new AppError(`Missing required field: ${field}`, 400),
  UNAUTHORIZED: (message = 'Authentication required') => new AppError(message, 401),
  INVALID_TOKEN: () => new AppError('Invalid or expired token', 401),
  INVALID_CREDENTIALS: () => new AppError('Invalid email or password', 401),
  FORBIDDEN: (message = 'You do not have permission to perform this action') => new AppError(message, 403),
  NOT_FOUND: (resource) => new AppError(`${resource} not found`, 404),
  ALREADY_EXISTS: (resource) => new AppError(`${resource} already exists`, 409),
  DUPLICATE_ENTRY: (field) => new AppError(`Duplicate entry for field: ${field}`, 409),
  FILE_TOO_LARGE: (maxSize) => new AppError(`File size exceeds maximum allowed size of ${maxSize}`, 413),
  INVALID_FILE_TYPE: (allowedTypes) => new AppError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 415),
  INTERNAL_ERROR: (message = 'Internal server error') => new AppError(message, 500),
  DATABASE_ERROR: (message = 'Database operation failed') => new AppError(message, 500),
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error Details:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    console.error('❌ Error:', {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });
  }
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw ErrorTypes.VALIDATION_ERROR(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ErrorTypes.INVALID_INPUT('email');
  }
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    throw ErrorTypes.VALIDATION_ERROR('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    throw ErrorTypes.VALIDATION_ERROR('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    throw ErrorTypes.VALIDATION_ERROR('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    throw ErrorTypes.VALIDATION_ERROR('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw ErrorTypes.VALIDATION_ERROR('Password must contain at least one special character');
  }
};
