const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Routine = require('../../models/Routine');
const User = require('../../models/User');

//@route POST ROUTE /api/routines
//@desc Create Route for workout routines
router.post('/', [
	auth,
	[
		check('title', 'A title is required and must be under 20 characters')
			.not()
			.isEmpty()
			.isLength({ max: 30 }),
		check('description', 'Please keep the description below 100 characters').isLength({ max: 100 }),
		check('workout', 'Please enter a routine')
			.not()
			.isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			res.status(400).json({ msg: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');

			const newRoutine = new Routine({
				user: req.user.id,
				userName: user.userName,
				title: req.body.title,
				description: req.body.description,
				workout: req.body.workout,
			});

			const routine = await newRoutine.save();

			res.json(routine);
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ msg: error.message });
		}
	},
]);

//@route GET ROUTE
//@desc get routines
router.get('/', auth, async (req, res) => {
	try {
		const routines = await Routine.find();
		res.json(routines);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: error.message });
	}
});

//@route GET ROUTE
//@desc get one routine
//@access private
router.get('/:id', auth, async (req, res) => {
	try {
		const routine = await Routine.findById(req.params.id);

		if (!routine) {
			res.status(400).json({ msg: 'Routine not found!' });
		}

		res.json(routine);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

//@route DELETE ROUTE
//@desc delete a routine
//@access private
router.delete('/:id', auth, async (req, res) => {
	try {
		const routine = await Routine.findById(req.params.id);

		if (!routine) {
			res.status(404).json({ msg: 'Routine was not found' });
		}

		if (routine.user.toString() !== req.user.id) {
			res.status(401).json({ msg: 'User not authorized' });
		}

		await routine.remove();

		res.json({ msg: 'Routine Removed' });
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Routine not found' });
		}
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

//@route PUT ROUTE
//@desc edit routine
//@access private
router.put(
	'/:id',
	[check('title').isLength({ max: 30 }), check('description').isLength({ max: 100 })],
	async (req, res) => {
		try {
			const routine = await Routine.findById(req.params.id);
		} catch (error) {}
	}
);

module.exports = router;
