const InvalidInputException = require('../Exceptions/InvalidInputException');
const NotLoggedInException = require('../Exceptions/NotLoggedInException');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err instanceof NotLoggedInException) {
    return res.status(statusCode).json({
      sucess: false,
      error: err.message,
      status: statusCode,
      loggedIn: err.loggedIn,
    });
  }

  return res.status(statusCode).json({
    sucess: false,
    error: err.message,
    status: statusCode,
  });
};

module.exports = errorHandler;
