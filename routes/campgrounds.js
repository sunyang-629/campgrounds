const express = require('express');
const router = express.Router();
const Campground = require('./../models/campground');


router.get("/", function (req, res) {
    // console.log(req.user.username);
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        res.render("./campgrounds/index",{campgrounds});
    })

})


router.get("/new", function (req, res) {
    res.render("./campgrounds/new");
}) 

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log(err);
        }
        res.render("./campgrounds/show", {campground})
    });
})

router.post("/", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    const newCampground = { name, image, description };
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    })
})

module.exports = router;