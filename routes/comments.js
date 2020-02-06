const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('./../models/campground');
const Comment = require('./../models/comment');
const middleware = require('./../middlewares/index');


router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("./comments/new",{campground});
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error","Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "No campground found")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
            }
        })
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
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

// function checkCommentOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.comment_id, (err, foundComment) => {
//             if (err) {
//                 res.redirect("back")
//             } else {
//                 if (foundComment.author.id && foundComment.author.id.equals(req.user._id)) {
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