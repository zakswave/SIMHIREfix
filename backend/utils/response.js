
export function sendSuccess(res, data, message = null, statusCode = 200) {
  const response = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

export function sendError(res, message, statusCode = 500, errors = null, code = null) {
  const response = {
    success: false,
    message,
  };

  if (errors && Array.isArray(errors)) {
    response.errors = errors;
  }

  if (code) {
    response.code = code;
  }

  return res.status(statusCode).json(response);
}

export function sendValidationError(res, errors, message = 'Validation failed') {
  return sendError(res, message, 400, errors, 'VALIDATION_ERROR');
}

export function sendNotFound(res, resource = 'Resource') {
  return sendError(res, `${resource} not found.`, 404, null, 'NOT_FOUND');
}

export function sendUnauthorized(res, message = 'Access denied. Please login.') {
  return sendError(res, message, 401, null, 'UNAUTHORIZED');
}

export function sendForbidden(res, message = 'You do not have permission to access this resource.') {
  return sendError(res, message, 403, null, 'FORBIDDEN');
}

export function sendBadRequest(res, message) {
  return sendError(res, message, 400, null, 'BAD_REQUEST');
}

export function sendServerError(res, message = 'Internal server error. Please try again later.') {
  return sendError(res, message, 500, null, 'INTERNAL_SERVER_ERROR');
}

export default {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendBadRequest,
  sendServerError,
};
