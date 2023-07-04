class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = (
      message || 'Переданны данные в некорректном формате.'
    );
  }
}

module.exports = ValidationError;
