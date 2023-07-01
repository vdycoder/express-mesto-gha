const User = require('../models/user');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE_500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_404)
          .send({
            message: `Пользователь по указанному _id:${userId} не найден.`,
          });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch(() => {
      res.status(ERROR_CODE_500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  User.create(newUserData)
    .then((newUser) => {
      res.status(STATUS_CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(ERROR_CODE_500)
          .send({
            message: 'Ошибка по умолчанию.',
          });
      }
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_404).send({
          message: `Пользователь с указанным _id:${userId} не найден.`,
        });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const updateAvatarById = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_404).send({
          message: `Пользователь с указанным _id:${userId} не найден.`,
        });
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
};
