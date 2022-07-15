/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
const User = require('../models/user');

const {
  badRequestError,
  notFoundError,
  serverError,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные для создания пользователя',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message:
            'Переданы некорректные данные Имя, Профессия или Аватар для создания профиля пользователя',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message:
            'Переданы некорректные данные Имя или Профессия для обновления профиля пользователя',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({
          message: 'Пользователь по указанному _id не найден',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные для обновления аватара',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
