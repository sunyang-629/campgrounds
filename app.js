const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
// const Campground = require('./models/campground');
// const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

// seedDB();
mongoose.connect("mongodb://localhost:27017/TWDB", { useNewUrlParser: true,  useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Once again Rusty win cutest dog!",
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', authRoutes);

app.listen(3000, function() {
      console.log('the Yelpcamp server has started!!');  
})