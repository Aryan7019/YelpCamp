const express = require('express');
const passport = require('passport'); // Import Passport
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(
        users.login 
    );

router.get('/logout', users.logout);

module.exports = router;
