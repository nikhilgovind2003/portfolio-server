const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  avatar: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Auth', authSchema);
