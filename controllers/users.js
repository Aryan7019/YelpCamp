const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegister = (req, res) => {
    res.render('Users/Register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('Users/Login');
}

module.exports.login = (req, res, next) => {
   const redirectUrl = req.session.returnTo || '/campgrounds';
   passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })(req, res, () => {
       delete req.session.returnTo;
       req.flash('success', `Welcome back, ${req.user.username}!`);
       res.redirect(redirectUrl);
   });
}

module.exports.logout = (req, res) => {
   req.logout((err) => {
       if (err) {
           return next(err);
       }
       req.flash('success', "Goodbye!");
       res.redirect('/');
   });
}
