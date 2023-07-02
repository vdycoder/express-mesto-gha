const {
  STATUS_CREATED,
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/status-codes');

const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
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
          .then((deletedCard) => res.send(deletedCard))
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

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий _id:${cardId} карточки.`,
        });
      } else {
        res.send(card);
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

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий _id:${cardId} карточки.`,
        });
      } else {
        res.send(card);
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
