const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

//@route   POST api/users
//@desc    Register a new user
//access   Public
router.post("/", [
        //Validate param entry
        check('name', 'Name is required').notEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'Password must contain at least 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        //Check for errors in param entry
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const { name, email, password } = req.body;
        try {
            //See if the user exists
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({ errors:[ { msg: "user already exists" } ] })
            }
            //Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Encrypt password
            //Create a salt for hashing
            const salt = await bcrypt.genSalt(10);
            //Create password
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            //Return jwt
        }catch (err) {
            console.error(err.message);
            resizeTo.status(500).send('Server Error');
        }

        res.send("User registered");
    }
);

module.exports = router;