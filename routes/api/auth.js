const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const User = require('../../models/User');

//@route   GET api/auth
//@desc    Test route
//access   Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//@route   POST api/auth
//@desc    Authenticate user and get a token
//access   Public
router.post("/", [
    //Validate param entry
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res) => {
    //Check for errors in param entry
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const { email, password } = req.body;
    try {
        //See if the user exists
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ errors:[ { msg: "Invalid Credentials" } ] })
        }

        //Validate password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ errors:[ { msg: "Invalid Credentials" } ] })
        }

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