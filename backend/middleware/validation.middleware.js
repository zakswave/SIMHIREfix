import { z } from 'zod';
export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
}
export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Query validation error',
      });
    }
  };
}
export function validateParams(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Parameter validation failed',
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Parameter validation error',
      });
    }
  };
}

export default {
  validate,
  validateQuery,
  validateParams,
};
