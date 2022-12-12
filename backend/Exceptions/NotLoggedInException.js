module.exports = class NotLoggedInException extends Error {
  constructor(message, loggedIn, statusCode) {
    super(message);
    this.loggedIn = loggedIn;
    this.statusCode = statusCode;
  }
};
