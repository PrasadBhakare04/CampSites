const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database Connected");
})

app.set('view engine', 'ejs');
app.set(path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')

});

app.get('/makeCampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard' });
    await camp.save();
    res.send(camp)
});

app.get('/campground', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
});

app.get('/campground/new', (req, res) => {
    res.render('campground/new')
});

app.post('/campground', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campground/${newCampground._id}`)
});

app.get('/campground/:id/edit', async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground })
});

app.put('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${campground._id}`)
});

app.get('/campground/:id', async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show', { campground })
});

app.delete('/campground/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});