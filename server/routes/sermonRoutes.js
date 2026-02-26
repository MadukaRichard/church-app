const router = require('express').Router();
const Sermon = require('../models/Sermon');

// 1. POST (Create a new sermon)
// Path: http://127.0.0.1:5000/api/sermons/
router.post('/', async (req, res) => {
  const newSermon = new Sermon(req.body);
  try {
    const savedSermon = await newSermon.save();
    res.status(200).json(savedSermon);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET (Get all sermons)
// Path: http://127.0.0.1:5000/api/sermons/
router.get('/', async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(sermons);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3.5 UPDATE (Edit a sermon)
router.put('/:id', async (req, res) => {
  try {
    const updatedSermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSermon);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE (Delete a sermon)
// Path: http://127.0.0.1:5000/api/sermons/:id
router.delete('/:id', async (req, res) => {
  try {
    await Sermon.findByIdAndDelete(req.params.id);
    res.status(200).json("Sermon has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;