/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */

const Card = require('../models/card');

const {
  badRequestError,
  notFoundError,
  serverError,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные имя или ссылка для создания карточки',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(notFoundError).send({
          message: 'Карточка с указанным _id не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(notFoundError).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(notFoundError).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequestError).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      }
      return res.status(serverError).send({
        message: 'На сервере произошла ошибка',
      });
    });
};
