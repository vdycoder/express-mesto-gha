class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = (
      message || 'Не переданы имя пользователя или пароль.'
    );
  }
}

module.exports = BadRequestError;
