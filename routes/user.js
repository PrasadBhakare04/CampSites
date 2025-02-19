const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const User = require('../models/user');
const flash = require('connect-flash');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You are now logged in!');
            res.redirect('/campground');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'You are now Logged in !');
    const redirectUrl = res.locals.returnTo || '/campground';
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        else {
            req.flash('success', "Logged out successfully");
            res.redirect('/campground');
        }
    })
})

module.exports = router;