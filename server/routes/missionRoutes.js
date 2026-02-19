const router = require('express').Router();
const Mission = require('../models/Mission');

// GET THE MISSION GOAL
router.get('/', async (req, res) => {
  try {
    let mission = await Mission.findOne();
    // If no mission exists yet, create a default one
    if (!mission) {
      mission = await new Mission().save();
    }
    res.status(200).json(mission);
  } catch (err) { res.status(500).json(err); }
});

// UPDATE THE MISSION GOAL
router.put('/', async (req, res) => {
  try {
    // Updates the first mission found, or creates one if empty
    const updatedMission = await Mission.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json(updatedMission);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;