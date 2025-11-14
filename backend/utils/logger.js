
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m',
  INFO: '\x1b[32m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
  RESET: '\x1b[0m',
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL 
      ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] 
      : LOG_LEVELS.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level];
    const reset = LOG_COLORS.RESET;

    let logMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`;

    if (data !== null) {
      logMessage += ` ${JSON.stringify(data, null, this.isDevelopment ? 2 : 0)}`;
    }

    return logMessage;
  }

  shouldLog(level) {
    return LOG_LEVELS[level] >= this.level;
  }

  debug(message, data = null) {
    if (this.shouldLog('DEBUG')) {
      console.log(this.format('DEBUG', message, data));
    }
  }

  info(message, data = null) {
    if (this.shouldLog('INFO')) {
      console.log(this.format('INFO', message, data));
    }
  }

  warn(message, data = null) {
    if (this.shouldLog('WARN')) {
      console.warn(this.format('WARN', message, data));
    }
  }

  error(message, error = null) {
    if (this.shouldLog('ERROR')) {
      const errorData = error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        ...error,
      } : null;

      console.error(this.format('ERROR', message, errorData));
    }
  }

  request(method, path, statusCode, duration) {
    const color = statusCode >= 400 ? LOG_COLORS.ERROR : LOG_COLORS.INFO;
    const reset = LOG_COLORS.RESET;

    this.info(
      `${color}${method}${reset} ${path} ${color}${statusCode}${reset} - ${duration}ms`
    );
  }

  db(operation, collection, data = null) {
    this.debug(`DB ${operation}: ${collection}`, data);
  }

  auth(event, userId = null, details = null) {
    this.info(`Auth ${event}${userId ? ` - User: ${userId}` : ''}`, details);
  }

  api(method, endpoint, data = null) {
    this.debug(`API ${method} ${endpoint}`, data);
  }
}
const logger = new Logger();

export default logger;

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req.method, req.path, res.statusCode, duration);
  });

  next();
};

export const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 DEV:', ...args);
  }
};
