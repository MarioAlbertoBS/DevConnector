const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

require('dotenv').config();

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
            //Set payload (token body)
            const payload = {
                id: user.id
            }
            //Sign the token with the secret key
            jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.TOKEN_EXPIRES },
                //Callback function
                (err, token) => {
                    //If an error happens, throw the error as exception
                    if (err) throw err;
                    //Return created token
                    res.json({token});
                }
            );
        }catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;