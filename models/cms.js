const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
  super_title: {
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
  btn_one_text: {
    type: String,
    required: true,
  },
  btn_one_link: {
    type: String,
    required: true,
  },
  btn_two_text: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
  },
  media_path: {
    type: String,
    required: true,
  },
  media_alt: {
    type: String,
    required: true,
  },
  project_title: {
    type: String,
    required: true,
  },
  skills_title: {
    type: String,
    required: true,
  },
  about_title: {
    type: String,
    required: true,
  },
  about_description: {
    type: String,
    required: true,
  },
  contact_title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cms', cmsSchema);
