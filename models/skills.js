const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  skills: {
    type: String,
    required: true,
  },
  media_path: {
    type: String,
  },
  media_alt: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  sort_order: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Skills', skillsSchema);
