const JOI = require('joi');
campGroundSchema = JOI.object({
    campground: JOI.object({
        title: JOI.string().required(),
        price: JOI.number().required().min(0),
        location: JOI.string().required(),
        image: JOI.string().required(),
        description: JOI.string().required()
    }).required()
}).required();

reviewSchema = JOI.object({
    review: JOI.object({
        body: JOI.string(),
        rating: JOI.number().min(1).max(5)
    }).required()
}).required();

module.exports.reviewSchema = reviewSchema;
module.exports.campGroundSchema = campGroundSchema;