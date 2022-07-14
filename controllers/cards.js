const Card = require("../models/card");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const InternalServerError = require("../errors/InternalServerError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new InternalServerError());
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для создания карточки"
          )
        );
      }
      next(new InternalServerError());
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Карточка с указанным _id не найдена"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для удаления карточки"
          )
        );
      }
      next(new InternalServerError());
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Передан несуществующий _id карточки"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для постановки лайка"
          )
        );
      }
      next(new InternalServerError());
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError("Передан несуществующий _id карточки"));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError("Переданы некорректные данные для снятия лайка")
        );
      }
      next(new InternalServerError());
    });
};
