const router = require('express').Router();
const Event = require('../models/Event');

// 1. GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. CREATE EVENT
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2.5 UPDATE EVENT
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE EVENT
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json("Event has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;