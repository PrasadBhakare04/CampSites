const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../controller/user');

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);

router.get('/logout', user.logoutUser);

module.exports = router;