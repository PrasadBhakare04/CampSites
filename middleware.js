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

module.exports.storeReturnTo = storeReturnTo;
module.exports.isLoggedIn = isLoggedIn;

