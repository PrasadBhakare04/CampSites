const mongoose = require('mongoose');
const Schema = mongoose.Schema;//due to this on line 4 we are using Schema({}) instead of mongoose.Schema({})

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

const Campground = new mongoose.model('Campgrond', campgroundSchema);
module.exports = Campground;