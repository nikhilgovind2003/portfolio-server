const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  media_path: {
    type: String,
  },
  media_alt: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  github_link: {
    type: String,
  },
  project_link: {
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
  technologies_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Projects', projectsSchema);
