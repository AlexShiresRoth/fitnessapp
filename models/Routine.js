const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoutineSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	date: {
		type: Date,
		default: Date.now,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	workout: {
		type: String,
		required: true,
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
		},
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = Routine = mongoose.model('routine', RoutineSchema);
