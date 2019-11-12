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

module.exports = router;
