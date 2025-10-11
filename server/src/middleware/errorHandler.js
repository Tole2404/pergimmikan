const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // If the error is from our ApiError class
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorHandler;
