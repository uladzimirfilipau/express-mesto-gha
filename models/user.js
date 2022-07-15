const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Это поле обязательно для заполнения'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Это поле обязательно для заполнения'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Это поле обязательно для заполнения'],
  },
});

module.exports = mongoose.model('user', userSchema);
