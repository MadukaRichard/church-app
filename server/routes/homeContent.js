const router = require('express').Router();
const HomeContent = require('../models/HomeContent');

// 1. GET the Home Content (Public)
router.get('/', async (req, res) => {
  try {
    // We try to find the first (and only) configuration document
    let content = await HomeContent.findOne();
    
    // If it doesn't exist yet (first time running), create a default one
    if (!content) {
      content = new HomeContent();
      await content.save();
    }
    
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. UPDATE the Home Content (Admin Only)
router.post('/', async (req, res) => {
  try {
    // We delete any old config to ensure there is only ever ONE home page config
    await HomeContent.deleteMany({});
    
    // Create the new one with the data you sent
    const newContent = new HomeContent(req.body);
    const savedContent = await newContent.save();
    
    res.status(200).json(savedContent);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;