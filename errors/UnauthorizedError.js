class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = (
      message || 'Переданы некорректные имя пользователя или пароль.'
    );
  }
}

module.exports = UnauthorizedError;
