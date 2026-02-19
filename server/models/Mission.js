const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  title: { type: String, default: "Global Mission" },
  raised: { type: Number, default: 0 },
  goal: { type: Number, default: 10000 }
});

module.exports = mongoose.model('Mission', MissionSchema);