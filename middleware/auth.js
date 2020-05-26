const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * req    = request
 * res    = response
 * next   = callback function
 */
module .exports = function(req, res, next) {
    //Get token from header
    const token = req.header(config.get('authHeader'));

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'Authorization denied, missing token' });
    }

    //Verify token
    try {
        //Decode token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        //Put the user id as a request value
        req.user = decoded.id;
        //Callback function
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}