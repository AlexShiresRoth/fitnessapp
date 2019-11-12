const mongoose = require("mongoose");

const RoutineSchema = new mongoose.Schema({
  day: {
    type: Date,
    default: Date.now
  },
  workout: {
    type: String,
    required: true
  }
});

module.exports = Routine = mongoose.model("routine", RoutineSchema);
