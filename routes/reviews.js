const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {validateReview,isloggedin,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isloggedin,validateReview, catchAsync(reviews.postroute))

router.delete('/:reviewID',isloggedin,isReviewAuthor, catchAsync(reviews.deleteroute))

module.exports = router;