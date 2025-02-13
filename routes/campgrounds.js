const express = require('express');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/ExpressError');
const Campground = require('../models/campground');
const { campGroundSchema } = require('../validateSchemas.js');


const router = express.Router();

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

router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
}));

router.get('/new', (req, res) => {
    res.render('campground/new')
});

router.post('/', validateSchema, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully created a new Campground');
    res.redirect(`/campground/${newCampground._id}`)
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campground')
    }
    res.render('campground/edit', { campground })
}));

router.put('/:id', validateSchema, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully Updated the Campground');
    res.redirect(`/campground/${campground._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campground')
    }
    else {
        res.render('campground/show', { campground })
    }
}));


router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground');
    res.redirect('/campground')
}));

module.exports = router;