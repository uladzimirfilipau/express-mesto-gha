const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.send(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.send(err));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => res.send(err));
};
