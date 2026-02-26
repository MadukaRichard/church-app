const router = require('express').Router();
const GiveCause = require('../models/GiveCause'); // You'll need a model for this

// 1. GET all causes (to show on the Give page)
router.get('/', async (req, res) => {
  try {
    const causes = await GiveCause.find();
    res.status(200).json(causes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. POST a new cause (From your Admin Dashboard)
router.post('/', async (req, res) => {
  const newCause = new GiveCause(req.body);
  try {
    const savedCause = await newCause.save();
    res.status(200).json(savedCause);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2.5 UPDATE a cause
router.put('/:id', async (req, res) => {
  try {
    const updatedCause = await GiveCause.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCause);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE a cause
router.delete('/:id', async (req, res) => {
  try {
    await GiveCause.findByIdAndDelete(req.params.id);
    res.status(200).json("Cause has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;