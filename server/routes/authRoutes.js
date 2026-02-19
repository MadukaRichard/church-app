const router = require('express').Router();
const jwt = require('jsonwebtoken');

// LOGIN ROUTE
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 1. Check Credentials against your .env file
  // It looks for ADMIN_USER and ADMIN_PASS in your environment variables
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    
    // 2. Generate a Digital Key (Token)
    // We sign it with your JWT_SECRET so no one can fake it
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // 3. Send the Key back to the Client
    res.json({ token });
  
  } else {
    // If password is wrong, send an error
    res.status(401).json("Invalid Credentials");
  }
});

module.exports = router;