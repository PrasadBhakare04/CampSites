const Campground = require('./models/campground');
const ExpressError = require('./Utils/ExpressError');

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
    if (!req.user || !campground.author.equals(req.user._id)) {
        req.flash('error', "You are not authorized to do that!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

const validateSchema = function (req, res, next) {
    const { error } = campGroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateSchema = validateSchema;
module.exports.isAuthor = isAuthor;
module.exports.storeReturnTo = storeReturnTo;
module.exports.isLoggedIn = isLoggedIn;

