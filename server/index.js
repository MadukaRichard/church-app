require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT ROUTES
const homeContentRoute = require('./routes/homeContent');
const sermonRoutes = require('./routes/sermonRoutes');
const givingRoutes = require('./routes/givingRoutes');
const heroRoute = require('./routes/heroRoutes'); 
const eventRoute = require('./routes/eventRoutes'); // Import here is fine
const missionRoute = require('./routes/missionRoutes');
const authRoute = require('./routes/authRoutes');

// 2. CREATE THE APP (Must happen BEFORE you use 'app')
const app = express();

// 3. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4. USE ROUTES (All app.use calls must be here)
app.use('/api/home', homeContentRoute);
app.use('/api/sermons', sermonRoutes);
app.use('/api/giving', givingRoutes);
app.use('/api/hero', heroRoute);
app.use("/api/events", eventRoute); // <--- MOVED HERE (Correct location)
app.use("/api/mission", missionRoute);
app.use("/api/auth", authRoute);


// 5. CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));