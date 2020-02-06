const express = require('express');
const router = express.Router();
const Campground = require('./../models/campground');
const middleware = require('./../middlewares/index');


router.get("/", function (req, res) {
    // console.log(req.user.username);
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        res.render("./campgrounds/index",{campgrounds});
    })

})


router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("./campgrounds/new");
}) 

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err || !campground) {
            req.flash("error", "Campground not found");
            return res.redirect('/campgrounds');
        }
        res.render("./campgrounds/show", {campground})
    });
})

router.post("/", middleware.isLoggedIn, function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = { name, price, image, description, author };
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    })
})

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground })
    })
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         res.redirect('/login');
//     }
// }

// function checkCampgroundOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         Campground.findById(req.params.id, (err, foundCampground) => {
//             if (err) {
//                 res.redirect("back")
//             } else {
//                 if (foundCampground.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     res.redirect("back")
//                 }
//             }
//         })
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;