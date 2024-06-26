const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//check is user is authonicated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    //make sure token exist
    if (!token) {
        return next(new ErrorResponse('You must Log In...', 401));
    }
    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponse('You must Log In...', 401));
    }
}

// middleware for admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'user') {
        return next(new ErrorResponse('Access denied, you must be admin', 401));
    }
    next();
}