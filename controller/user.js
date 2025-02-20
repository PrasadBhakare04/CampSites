const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const flash = require('connect-flash');


module.exports.renderRegister = (req, res) => {
    res.render('user/register');
};

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You are now logged in!');
            res.redirect('/campground')
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('user/login')
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'You are now Logged in !');
    const redirectUrl = res.locals.returnTo || '/campground';
    res.redirect(redirectUrl)
};

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        else {
            req.flash('success', "Logged out successfully");
            res.redirect('/campground');
        }
    })
};