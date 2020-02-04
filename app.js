const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

seedDB();
mongoose.connect("mongodb://localhost:27017/TWDB", { useNewUrlParser: true,  useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
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
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', authRoutes);

// Campground.create({
//     name: "Salmon Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOnXO5O-5s0EcQCBxL5JMKmg9GgU9M2D7c5tzriDISy_oDkvVB&s"
// }, (err, campground) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log('NEWLY CREATED CAMPGROUND');
//         console.log(campground);
// })

// const campgrounds = [
//     { name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTptz9YhkX9INTI6F4RaiSnhLCJDbqcl4qqFuJZyHi6--PnrPCj&s" },
//     { name: "Salmon Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOnXO5O-5s0EcQCBxL5JMKmg9GgU9M2D7c5tzriDISy_oDkvVB&s" },
//     { name: "Mountain Goat's Rest", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYS1T2yCqPdvz2aW_1HZ7HFeuq0zAyTltOqsxz40gO4Ca8K72cPQ&s" },
//     { name: "Giovanie Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtSFPkXopIAg-PP60UvrvXOahdY-btwV-GMaVzjHP0UazAFoz&s" },
//     { name: "Rashford", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTptz9YhkX9INTI6F4RaiSnhLCJDbqcl4qqFuJZyHi6--PnrPCj&s" },
//     { name: "Matrial", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOnXO5O-5s0EcQCBxL5JMKmg9GgU9M2D7c5tzriDISy_oDkvVB&s" },
//     { name: "Mata", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYS1T2yCqPdvz2aW_1HZ7HFeuq0zAyTltOqsxz40gO4Ca8K72cPQ&s" },
//     { name: "James", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtSFPkXopIAg-PP60UvrvXOahdY-btwV-GMaVzjHP0UazAFoz&s" },
// ];


// app.get("/", function(req, res){
//     res.render("landing");
// })

// app.get("/campgrounds", function (req, res) {
//     // console.log(req.user.username);
//     Campground.find({}, (err, campgrounds) => {
//         if (err) {
//             console.log(err);
//         }
//         res.render("./campgrounds/index",{campgrounds});
//     })

// })


// app.get("/campgrounds/new", function (req, res) {
//     res.render("./campgrounds/new");
// }) 

// app.get("/campgrounds/:id", function (req, res) {
//     Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
//         if (err) {
//             console.log(err);
//         }
//         res.render("./campgrounds/show", {campground})
//     });
// })

// app.post("/campgrounds", function (req, res) {
//     var name = req.body.name;
//     var image = req.body.image;
//     var description = req.body.description;
//     const newCampground = { name, image, description };
//     // campgrounds.push(newCampground);
//     Campground.create(newCampground, (err, newlyCreated) => {
//         if (err) {
//             console.log(err);
//         }
//         res.redirect("/campgrounds");
//     })
// })

//============================================================================

// app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
//     Campground.findById(req.params.id, (err, campground) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("./comments/new",{campground});
//         }
//     })
// })

// app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
//     Campground.findById(req.params.id, (err, campground) => {
//         if (err) {
//             console.log(err);
//             redirect("/campgrounds")
//         } else {
//             Comment.create(req.body.comment, (err, comment) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     campground.comments.push(comment);
//                     campground.save();
//                     res.redirect("/campgrounds/" + campground._id);
//                 }
//             })
//         }
//     })
// })

//====================================================================================

// app.get("/register", (req, res) => {
//     res.render('register');
// })


// // app.post('/register', (req, res) => {
// //     res.send('signing you up..........')
// // })

// app.post('/register', (req, res) => {
//     const newUser = new User({ username: req.body.username })
//     User.register(newUser, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             return res.render('register')
//         } else {
//             passport.authenticate('local')(req, res, () => {
//                 res.redirect('/campgrounds');
//             })
//         }
//     });
// })

// app.get('/login', (req, res) => {
//     res.render('login');
// })

// app.post('/login', passport.authenticate('local',
//     {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     }), (req, res) => {
    
// })

// app.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/campgrounds");
// })

// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         res.redirect('/login');
//     }
// }

app.listen(3000, function() {
      console.log('the Yelpcamp server has started!!');  
})