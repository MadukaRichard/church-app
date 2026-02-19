
const mongoose = require('mongoose');

const SermonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  preacher: { type: String, required: true },
  videoLink: { type: String, required: true },
  category: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Sermon', SermonSchema);