const mongoose = require('mongoose');

const { Schema } = mongoose;

// we create the game schema
const GameSchema = new Schema({
  name: { // the name of the game,
    type: String,
    required: true,
  },
  players: [{ name: String, points: Number }],
  description: String,
});

// exporting the module
module.exports = mongoose.model('Game', GameSchema);
