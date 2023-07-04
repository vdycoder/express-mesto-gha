const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors, Joi } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const linkValidation = require('./utils/linkValidation');
const NotFoundError = require('./errors/NotFoundError');
const handleErrors = require('./middlewares/handleErrors');

const {
  PORT = 3000,
  DB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();
app.use(helmet());
const limits = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limits);
app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(20),
      avatar: Joi.string().regex(linkValidation),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Передан несуществующий путь.'));
});
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Приложение запущено и принимает запросы на порт: ${PORT}`);
});
