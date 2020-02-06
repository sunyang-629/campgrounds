const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const passport = require('passport');



router.get("/", function(req, res){
    res.render("landing");
})


router.get("/register", (req, res) => {
    res.render('register');
})


// app.post('/register', (req, res) => {
//     res.send('signing you up..........')
// })

router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err.message);
            req.flash("error", err.message);
            return res.redirect('/register')
        } else {
            passport.authenticate('local')(req, res, () => {
                req.flash("success","Welcome to YelpCamp " + user.username);
                res.redirect('/campgrounds');
            })
        }
    });
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local',
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
    
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success","logged you out")
    res.redirect("/campgrounds");
})

module.exports = router;