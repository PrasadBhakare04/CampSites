const Campground = require('./models/campground');

const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first !');
        return res.redirect('/login');
    }
    else {
        next();
    }
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async function (req, res, next) {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (req.user && req.user._id === campground.author._id) {
        return next();
    }
    req.flash('error', "You are not authorized to do that !");
    res.redirect(`/campground/${id}`)
}

module.exports.isAuthor = isAuthor;
module.exports.storeReturnTo = storeReturnTo;
module.exports.isLoggedIn = isLoggedIn;

