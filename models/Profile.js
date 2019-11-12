const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	email: {
		type: String,
	},
	routines: {
		type: Array,
	},
	likes: {
		type: Array,
	},
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
