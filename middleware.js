const Campground = require('./models/campground');
const Review = require('./models/review');
const { campGroundSchema, reviewSchema } = require('./validateSchemas');
const ExpressError = require('./Utils/ExpressError');

module.exports.validateSchema = function (req, res, next) {
    const { error } = campGroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first !');
        return res.redirect('/login');
    }
    else {
        next();
    }
}

module.exports.isAuthor = async function (req, res, next) {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You are not authorized to do that!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async function (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You are not authorized to do that!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}