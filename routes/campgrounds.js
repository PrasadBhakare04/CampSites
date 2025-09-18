const express = require('express');
const catchAsync = require('../Utils/catchAsync');
const campground = require('../controller/campground');
const { isLoggedIn, isAuthor, validateSchema } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(isLoggedIn, catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateSchema, catchAsync(campground.createCampground));

router.get('/new', isLoggedIn, campground.renderNewForm);

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, upload.array('image'), validateSchema, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, catchAsync(campground.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;
