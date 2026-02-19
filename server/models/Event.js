const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // e.g. "Sunday, 9:00 AM"
  image: { type: String },
  desc: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);