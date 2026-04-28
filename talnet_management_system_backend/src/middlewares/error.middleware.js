import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Default values
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Internal server error';

  // Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = new AppError('Duplicate field value', 409);
  }

  if (err.name === 'SequelizeValidationError') {
    error = new AppError(err.errors[0].message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // DEV vs PROD
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 ERROR:', err);

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      stack: err.stack,
    });
  }

  // PRODUCTION
if (process.env.NODE_ENV === 'production') {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Unknown / programming error
  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
}
};
