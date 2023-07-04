const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET_KEY = 'super-duper-private-key';

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Требуется пройти авторизацию.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Требуется пройти авторизацию.'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
