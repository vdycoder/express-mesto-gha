class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = (
      message || 'Отказано в доступе.'
    );
  }
}

module.exports = ForbiddenError;
