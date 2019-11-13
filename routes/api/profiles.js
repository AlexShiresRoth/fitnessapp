const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@route POST ROUTE
//@desc create profile route

router.post('/', auth, async (req, res) => {
	const user = await User.findById(req.user.id);

	const profileFields = {};
	profileFields.social = {};

	const { avatar, bio, facebook, spotify, instagram, pinterest, twitter } = req.body;
	profileFields.user = req.user.id;
	profileFields.username = user.username;
	profileFields.email = user.email;
	if (bio) profileFields.bio = bio;
	if (avatar) profileFields.avatar = avatar;
	if (facebook) profileFields.social.facebook = facebook;
	if (spotify) profileFields.social.spotify = spotify;
	if (instagram) profileFields.social.instagram = instagram;
	if (pinterest) profileFields.social.pinterest = pinterest;
	if (twitter) profileFields.social.twitter = twitter;

	try {
		const profile = await Profile.findOne({ user: req.user.id });

		if (profile) {
			return res.status(400).json({ msg: 'User Already has a profile' });
		}

		const newProfile = new Profile(profileFields);

		await newProfile.save();

		console.log(newProfile);

		res.json(newProfile);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

router.get('/me', auth, async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id });

		console.log(foundProfile);
		res.json(foundProfile);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

module.exports = router;
