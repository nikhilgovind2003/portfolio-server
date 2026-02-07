const mongoose = require('mongoose');

// Define schema
const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  projects_list: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projects',
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Technology', technologySchema);
