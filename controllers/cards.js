const Card = require('../models/card');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => {
      res.status(ERROR_CODE_500).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий _id:${cardId} карточки.`,
        });
      } else {
        Card.findByIdAndRemove(cardId)
          .then((deletedCard) => res.status(STATUS_OK).send(deletedCard))
          .catch(() => {
            res.status(ERROR_CODE_500).send({
              message: 'Ошибка по умолчанию.',
            });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const likeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий _id:${cardId} карточки.`,
        });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user._id } },
          { new: true },
        )
          .then((updatedCard) => res.status(STATUS_OK).send(updatedCard))
          .catch(() => {
            res.status(ERROR_CODE_500).send({
              message: 'Ошибка по умолчанию.',
            });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const dislikeCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий _id:${cardId} карточки.`,
        });
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } },
          { new: true },
        )
          .then((updatedCard) => res.status(STATUS_OK).send(updatedCard))
          .catch(() => {
            res.status(ERROR_CODE_500).send({
              message: 'Ошибка по умолчанию.',
            });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      } else {
        res.status(ERROR_CODE_500).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCardById,
  dislikeCardById,
};
