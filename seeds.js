const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
    {
        name: "Granite Hill",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTptz9YhkX9INTI6F4RaiSnhLCJDbqcl4qqFuJZyHi6--PnrPCj&s",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Salmon Creek",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOnXO5O-5s0EcQCBxL5JMKmg9GgU9M2D7c5tzriDISy_oDkvVB&s",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYS1T2yCqPdvz2aW_1HZ7HFeuq0zAyTltOqsxz40gO4Ca8K72cPQ&s",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Cloud's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtSFPkXopIAg-PP60UvrvXOahdY-btwV-GMaVzjHP0UazAFoz&s",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
]

function seedDB() {
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("remove campgrounds!");
        data.forEach(seed => Campground.create(seed, (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                console.log("add a campground");
                Comment.create({
                    text: 'This place is great, but I wish there was internet',
                    author: "Homer"
                }, (err, comment) => {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                        }
                })
            }
        }))
    });
}

module.exports = seedDB;