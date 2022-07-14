const User = require("../models/user");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const InternalServerError = require("../errors/InternalServerError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new InternalServerError());
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан несуществующий _id"));
      }
      next(new InternalServerError());
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для создания пользователя"
          )
        );
      }
      next(new InternalServerError());
    });
};

module.exports.updateUserInfo = (req, res, next) => {
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
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для обновления профиля"
          )
        );
      }
      next(new InternalServerError());
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении аватара"
          )
        );
      }
      next(new InternalServerError());
    });
};
