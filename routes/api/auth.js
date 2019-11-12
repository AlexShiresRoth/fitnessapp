const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@Route GET api/auth
//@desc Test Route
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

router.post(
	'/',
	[check('email', 'Please use a valid email').isEmail(), check('password', 'A password is required').exists()],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			const isMatched = await bcrypt.compare(password, user.password);

			if (!isMatched) {
				res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 40000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
			console.log(user);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Internal Server Error');
		}
	}
);

module.exports = router;
