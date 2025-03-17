const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err ) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
  
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: `Route ${req.method} ${req.url} not found`
    });
  };
  
  module.exports = { errorHandler, notFoundHandler };
  