const express = require('express');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware');


router.post('/', validateReview, catchAsync(async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    req.flash('success', 'Successfully posted a Review');
    res.redirect(`/campground/${foundCampground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted the Review');
    res.redirect(`/campground/${id}`)
}));

module.exports = router;