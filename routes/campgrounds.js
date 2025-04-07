const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isloggedin,validateCampground,isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
      .get( campgrounds.index)
      .post(isloggedin, upload.array('image'),validateCampground, catchAsync(campgrounds.newform))

router.get('/new',isloggedin, campgrounds.rendernew)      

router.route('/:id')
      .get(campgrounds.showcampground)
      .put(isloggedin,upload.array('image'),validateCampground,isAuthor, campgrounds.editform)
      .delete(isAuthor, campgrounds.deletecampground)

router.get('/:id/edit' ,isloggedin,isAuthor, campgrounds.renderedit)

module.exports = router;