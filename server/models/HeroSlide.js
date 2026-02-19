const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  buttonText: { type: String, default: "Learn More" },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);