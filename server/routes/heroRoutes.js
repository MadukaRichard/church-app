// server/routes/heroRoutes.js
const router = require('express').Router();
const HeroSlide = require('../models/HeroSlide');

// GET ALL SLIDES
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SLIDE
router.post('/', async (req, res) => {
  const newSlide = new HeroSlide(req.body);
  try {
    const savedSlide = await newSlide.save();
    res.status(201).json(savedSlide);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE SLIDE
router.delete('/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.status(200).json("Slide deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;