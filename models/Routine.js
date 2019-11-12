const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
	day: {
		type: Date,
		default: Date.now,
	},
	workout: {
		type: String,
		required: true,
	},
	comments: {
		type: Array,
	},
});

module.exports = Routine = mongoose.model('routine', RoutineSchema);
