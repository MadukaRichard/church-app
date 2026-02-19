const mongoose = require('mongoose');

const GiveCauseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }, // Short summary
  story: { type: String }, // <--- NEW: The Long "Mini-Blog" content
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('GiveCause', GiveCauseSchema);