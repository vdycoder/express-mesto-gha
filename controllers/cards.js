const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const {
  STATUS_CREATED,
} = require('../utils/statusCodes');

const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(
          'Переданы некорректные данные при создании карточки.',
        ));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(
          `Передан несуществующий _id:${cardId} карточки.`,
        ));
      } else if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError(
          'Не достаточно прав для удаления карточки',
        ));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные для удаления карточки.',
        ));
      } else {
        next(err);
      }
    });
};

const likeCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(
          `Передан несуществующий _id:${cardId} карточки.`,
        ));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      } else {
        next(err);
      }
    });
};

const dislikeCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(
          `Передан несуществующий _id:${cardId} карточки.`,
        ));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ));
      } else {
        next(err);
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
