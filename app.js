const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment')
const seedDB = require('./seeds');

seedDB();
mongoose.connect("mongodb://localhost:27017/TWDB", { useNewUrlParser: true,  useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



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


app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function (req, res) {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        res.render("./campgrounds/index",{campgrounds});
    })

})


app.get("/campgrounds/new", function (req, res) {
    res.render("./campgrounds/new");
}) 

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log(err);
        }
        res.render("./campgrounds/show", {campground})
    });
})

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    const newCampground = { name, image, description };
    // campgrounds.push(newCampground);
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds");
    })
})

//============================================================================

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("./comments/new",{campground});
        }
    })
})

app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

app.listen(3000, function() {
      console.log('the Yelpcamp server has started!!');  
})