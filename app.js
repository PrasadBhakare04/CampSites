const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./Utils/ExpressError');
const catchAsync = require('./Utils/catchAsync');
const ExpressError = require('./Utils/ExpressError');
const JOI = require('joi');
const { campGroundSchema, reviewSchema } = require('./validateSchemas.js');
const Review = require('./models/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

const validateReview = function (req, res, next) {
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

app.get('/', (req, res) => {
    res.render('home')

});

app.get('/makeCampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'My Backyard' });
    await camp.save();
    res.send(camp)
}));

app.get('/campground', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
}));

app.get('/campground/new', (req, res) => {
    res.render('campground/new')
});

app.post('/campground', validateSchema, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campground/${newCampground._id}`)
}));

app.get('/campground/:id/edit', catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground })
}));

app.put('/campground/:id', validateSchema, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${campground._id}`)
}));

app.get('/campground/:id', catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campground/show', { campground })
}));

app.post('/campground/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    res.redirect(`/campground/${foundCampground._id}`);
}))

app.delete('/campground/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`)
}))

app.delete('/campground/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
}));


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { message = "Something Happened", statusCode = 500, stack } = err;
    // console.log(stack);
    res.status(statusCode).render('error', { message, statusCode })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});