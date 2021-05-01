// require install moudels
const express = require('express');
const router = express.Router();
const passport = require('passport');
// require app files
const { forwardAuthenticated } = require('../config/auth');
const usersController = require('../controllers/usersController');

// registration routes
router.get('/register', forwardAuthenticated, usersController.register);
router.post('/register', usersController.createUser);

// login routes
router.get('/login', forwardAuthenticated, usersController.login);
router.post('/login', usersController.loginUser);

// Account verification link
router.get('/activate/:temporarytoken', usersController.activate);

// Forgot routes
router.get('/forgot', usersController.forgot);
router.post('/forgot', usersController.forgotPass);
router.get('/reset/:token', usersController.reset);
router.post('/reset/:token', usersController.restPass);

// google authencation 
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));
// handle google athentication 
router.get('/google/redirect', passport.authenticate('google'), usersController.googleAuth);

//logout route
router.get('/logout', usersController.logout);

// export the router
module.exports = router;