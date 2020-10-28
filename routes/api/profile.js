const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const axios = require('axios');

require('dotenv').config();

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route   GET api/profile/me
//@desc    Get the current users profile
//access   Private
router.get("/me", auth, async (req, res) => {
    try {
        profile = await Profile.findOne({ user: req.user }).populate('user',
        ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   POST api/profile
//@desc    Create or update a user profile
//access   Private
router.post("/", [ auth,
    [
        check('status', 'Status is required').notEmpty(),
        check('skills', 'Skills is required').notEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    
    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({ user: req.user });

        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user }, 
                { $set: profileFields }, 
                { new: true, useFindAndModify: false }
            );

            return res.json(profile);
        }

        //Create a new profile
        profile = new Profile(profileFields);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   GET api/profile
//@desc    Get profiles
//access   Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   GET api/profile/user/:user_id
//@desc    Get profiles by user id
//access   Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route   DELETE api/profile
//@desc    Delete profile, user & posts
//access   Private
router.delete('/', auth, async (req, res) => {
    try {
        //remove users posts
        await Post.deleteMany({user: req.user.id });

        //Remove profile
        await Profile.findOneAndRemove({ user: req.user });
        
        await User.findOneAndRemove({_id: req.user })

        res.json({ msg: 'User Deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/profile/experience
//@desc    Add profile experience
//access   Private
router.put('/experience', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'Initial Date is required')
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    }

    try {
        const profile = await Profile.findOne({ user: req.user });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile Does not exists' });
        }

        //Add the subdocument (object to experience array)
        profile.experience.unshift(newExp);
        await profile.save();
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/profile/experience/:exp_id
//@desc    Update an existing experience object
//@access  Private
router.put('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });

        //Get the update index
        const updateIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        if (updateIndex < 0) {
            return res.status(400).json({ msg: 'Invalid Item ID: Experience' });
        }

        //Get the experience object
        const newExp = profile.experience[updateIndex];

        //Set new experience values
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        if (title) newExp.title = title;
        if (company) newExp.company = company;
        if (location) newExp.location = location;
        if (from) newExp.from = from;
        if (to) newExp.to = to;
        newExp.current = current ? true : false;
        if (description) newExp.description = description;
        
        //Save changes
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete profile experience
//access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });

        //Get the remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'Invalid Item ID: "Experience"' });
        }

        //Remove index
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/profile/education
//@desc    Add profile education
//access   Private
router.put('/education', [auth, [
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of Study is required'),
    check('from', 'Initial Date is required')
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    }

    try {
        const profile = await Profile.findOne({ user: req.user });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile Does not exists' });
        }

        //Add the subdocument (object to education array)
        profile.education.unshift(newEdu);
        await profile.save();
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/profile/education/:edu_id
//@desc    Update an existing education object
//@access  Private
router.put('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });

        //Get the update index
        const updateIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
        if (updateIndex < 0) {
            return res.status(400).json({ msg: 'Invalid Item ID: Education' });
        }

        //Get the education object
        const newEdu = profile.education[updateIndex];
        
        //Set new education values
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        if (school) newEdu.school = school;
        if (degree) newEdu.degree = degree;
        if (fieldofstudy) newEdu.fieldofstudy = fieldofstudy;
        if (from) newEdu.from = from;
        if (to) newEdu.to = to;
        newEdu.current = current ? true : false;
        if (description) newEdu.description = description;
        
        //Save changes
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   DELETE api/profile/education/:edu_id
//@desc    Delete profile education
//access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user });

        //Get the remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        if (removeIndex < 0) {
            return res.status(400).json({ msg: 'Invalid Item ID: Education' });
        }

        //Remove index
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route   GET api/profile/github/:username
//@desc    Get user repos from Github
//access   Public
router.get("/github/:username", async (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENTID}&client_secret=${process.env.GITHUB_SECRET}`,
            method: "GET",
            headers: { userAgent: "node.js" },
        };
        //Make request
        await axios(options).then((response) => {
        res.json(response.data);
        });
    } catch (err) {
        console.error(err.message);
        if (err.response.status === 404) {
            return res.status(404).json({ msg: "No Github Profile found" });
        }
        res.status(500).send("Server Error");
    }
});


module.exports = router;