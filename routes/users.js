const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const linkValidation = require('../utils/linkValidation');
const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  getUserById,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserById,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(linkValidation),
    }),
  }),
  updateAvatarById,
);

module.exports = router;
