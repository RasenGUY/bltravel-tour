const express         = require("express"),
      router          = express.Router();
      Tour            = require('../models/tour.js'),
      User            = require('../models/user.js');


// middleware (used for admin page)
let isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/admin')
}
// pageInfo
let page = {
  title: "",
}
// GET ROUTE for landing page
router.get("/", (req, res) => {
  page.title = "Experience Laos Trough the Eyes of a local"

  Tour.find({}).limit(4).sort({date: -1}).exec((err, tours) => {
    if (err){
      console.log(err);
    } else {
      res.render("home", {tours: tours, page: page});
    }
  });
});

// GET ROUTE for SEARCH box on INDEX (landing) page
router.get("/results", function (req, res){
    page.title = "Search Results"
    Tour.find({
      $or: [
        {
          locations: req.query.location
        },
        {
          categories: req.query.category
        }
      ]
    }, function (err, results){
    if (err){
      console.log(err);
    } else {
      console.log(results);
      res.render("results", {query: results, page: page})
    }
  })
});

// GET ROUTE for ABOUT page
router.get("/about", function(req, res){
  page.title = "About us"
  res.render("about", {page: page});
});

// GET ROUTE for index page
router.get("/tours", function(req, res){
  page.title = "All The Tours We Offer"
  Tour.find({}, function(err, tours){
    if (err){
      res.send(err);
    } else {
      var tours = tours;
      res.render("index", {tours: tours, page: page});
    }
  })
});

// SHOW ROUTE individual TOUR page (displaying all of the information)
router.get("/tours/:id", (req, res) => {
  Tour.findById(req.params.id, function(err, tour){
    if (err){
      console.log(err);
    } else {
      page.title = tour.title
      res.render("show", {tour: tour, page: page});
    }
  })
});

// GET ROUTE for CONTACTS page
router.get("/contact", function(req, res){
  page.title = "Contact"
  res.render("contact", {page: page});
});

// GET ROUTE REGISTER page
router.get("/tours/:id/register", (req, res) => {
  page.title = "Register"
  Tour.findById(req.params.id, function(err, tour){
    if (err){
      console.log(err);
    }else {
      res.render("register", {tour: tour, page: page});
    }
  });
});

// One time creation of user
// User.register(new User({username: "BltravelT"}), "Tan77772911", (err, user) => {
//   if (err){
//     console.log(err);
//     // res.render('/login');
//   }
// })


module.exports = router;
