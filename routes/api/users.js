const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//TODO setup img upload with cloudinary and multer

//@route POST ROUTE
//@desc create route for users
router.post(
	'/',
	[
		check('username', 'userName is required')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password longer than 6 characters').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const { username, email, password, avatar } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ msg: 'User Already Exists ' });
			}

			user = new User({
				username,
				email,
				password,
				avatar,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();
			//return json webtoken
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 40000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).json({ msg: 'Internal Server Error' });
		}
	}
);

module.exports = router;
