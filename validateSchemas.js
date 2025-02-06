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
module.exports.campGroundSchema = campGroundSchema;