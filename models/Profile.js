const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	username: {
		type: String,
	},
	email: {
		type: String,
	},
	avatar: {
		type: String,
	},
	bio: {
		type: String,
	},
	routines: {
		type: Array,
	},
	likes: {
		type: Array,
	},
	social: {
		facebook: {
			type: String,
		},
		instagram: {
			type: String,
		},
		pinterest: {
			type: String,
		},
		twitter: {
			type: String,
		},
		spotify: {
			type: String,
		},
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
