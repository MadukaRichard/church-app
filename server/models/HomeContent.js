const mongoose = require('mongoose');

const HomeContentSchema = new mongoose.Schema({
  heroTitle: { 
    type: String, 
    default: "Church Without Walls" 
  },
  heroSubtitle: { 
    type: String, 
    default: "Interactive. Global. Spirit-filled. Join us from anywhere." 
  },
  heroImage: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
  },
  liveLink: { 
    type: String, 
    default: "https://youtube.com" 
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeContent', HomeContentSchema);