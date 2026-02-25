const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  is_current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  media_path: {
    type: String,
  },
  media_alt: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Experience', experienceSchema);
