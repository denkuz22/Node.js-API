const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name']
  },
  position: {
    type: String,
    required: [true, 'Please add position'],
    enum: ['PG', 'SG', 'SF','PF','C']
  },
  seniorYear: {
    type: Boolean,
    required: true
  },
  height: {
    type: String,
    required:[true,'Please add a height']
  },
  weight: {
    type: Number,
    required:[true,'Please add a weight in lbs']
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', PlayerSchema)