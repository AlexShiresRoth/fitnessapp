const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Routine = require('../../models/Routine');
const User = require('../../models/User');

//TODO add a like and unlike route for comments

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
	auth,
	[check('title').isLength({ max: 30 }), check('description').isLength({ max: 100 })],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ msg: errors.array() });
		}

		const foundRoutine = await Routine.findById(req.params.id);

		const { title, description, workout } = req.body;

		try {
			if (foundRoutine.user.toString() !== req.user.id) {
				res.status(401).json({ msg: 'User not authorized' });
			}

			await foundRoutine.updateOne(
				{
					$set: { title, description, workout },
				},
				{ new: true }
			);
			await foundRoutine.save();

			console.log(foundRoutine);
			res.json(foundRoutine);
		} catch (error) {
			console.error(error.message);

			if (error.kind === 'ObjectId') {
				res.status(404).json({ msg: 'Routine Not Found' });
			}
			res.status(500).json({ msg: 'Internal Server Error, Please Contact Support' });
		}
	}
);

//@route PUT ROUTE
//@desc update route for adding likes to a routine

router.put('/like/:id', auth, async (req, res) => {
	try {
		const routine = await Routine.findById(req.params.id);

		if (routine.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
			res.status(400).json({ msg: 'Routine already liked' });
		}

		routine.likes.unshift({ user: req.user.id });

		await routine.save();
		console.log(routine.likes);
		res.json(routine.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

//@route PUT ROUTE
//@desc remove a like from a routine
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const routine = await Routine.findById(req.params.id);

		if (routine.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
			res.status(400).json({ msg: 'Routine has not been liked' });
		}

		const indexOfLike = routine.likes.map(like => like.user.toString().indexOf(req.user.id));

		routine.likes.splice(indexOfLike, 1);

		await routine.save();

		res.json(routine.likes);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

//@route PUT ROUTE
//@desc add comment to routine
router.put(
	'/comment/:id',
	[
		auth,
		[
			check('text', 'You cannot send an empty comment :(')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ msg: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const routine = await Routine.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.username,
				user: req.user.id,
			};

			routine.comments.unshift(newComment);
			await routine.save();
			res.json(routine.comments);
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ msg: 'Internal Server Error' });
		}
	}
);

//@route PUT ROUTE
//@desc delete a comment

router.put('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const routine = await Routine.findById(req.params.id);

		const foundComment = routine.comments.find(comment => comment.id === req.params.comment_id);

		if (!foundComment) {
			return res.status(404).json({ msg: 'Uh oh! this comment cannot be found :(' });
		}

		if (req.user.id !== foundComment.user.toString()) {
			return res.status(400).json({ msg: 'User Not Authorized' });
		}

		const filteredComments = routine.comments.filter(comment => comment.id !== req.params.comment_id);

		routine.comments = filteredComments;

		await routine.updateOne({ $set: { comments: filteredComments } });
		await routine.save();
		console.log(routine);
		res.json(routine.comments);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

module.exports = router;
