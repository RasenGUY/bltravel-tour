// requires
const express          = require("express"),
      mongoose         = require("mongoose"),
      bodyParser       = require("body-parser"),
      methodOverride   = require('method-override'),
      Tour             = require('../models/tour'),
      User             = require('../models/user'),
      passport         = require('passport');
      router           = express.Router();

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

// LOGIN ROUTES
router.get('/admin', (req, res) => {
  page.title = "Administration"
  res.render('admin', {page: page});
});

router.post('/admin', passport.authenticate('local', {
  successRedirect: '/admin/options',
  failureRedirect: '/admin',
  failureFlash: 'Invalid username and or password'
}), (req, res) => {
});

// LOGOUT ROUTES
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/admin')
});

// GET ROUTE for index page
router.get("/admin/tours/", isLoggedIn, function(req, res){
  page.title = "Tours"

  Tour.find({}, function(err, tours){
    if (err){
      res.send(err);
    } else {
      var tours = tours;
      res.render("index-admin", {tours: tours, page: page});
    }
  })
});

// routes for editing the tours
// GET ROUTES CREATE sequence
//new
router.get("/admin/tours/new", isLoggedIn, (req, res) => {
  page.title = "Create New Tour"
  res.render("new", {page: page});
});

//start create sequence
router.post("/admin/tours/new", isLoggedIn, (req, res) => {

  req.body.tour.categories = String(req.body.tour.categories).split(" ");
  req.body.tour.locations = String(req.body.tour.locations).split(" ");

  Tour.create(req.body.tour, (err, tour) => {
    if (err){
      console.log(err);
    } else{
      // call jquery function
      console.log("you created the general info of a new tour, now proceed to add the information related to the tour");
      res.redirect("/admin/tours/" + tour._id + "/dayinfo");

    }
  });
});



// redirected from /tours/new page
router.get("/admin/tours/:id/dayinfo", isLoggedIn, (req, res) => {
  page.title = "General Information of Day"
  Tour.findById(req.params.id, (err, tour) =>{
    if (err) {
      console.log(err);
    } else {
      res.render("dayinfo", {tour: tour, page: page});
    }
  })

});

// ROUTES for the whole process of creating a new tour
router.put("/admin/tours/:id/dayinfo", isLoggedIn, (req, res) => {
  Tour.findById(req.params.id, (err, tour) => {
    if (err) {
      console.log(err)
    } else {
      for (let i = 1; i <= tour.duration; i++){
        console.log(req.body["dayInfo" + String(i)])
        Tour.update({_id: req.params.id}, {$addToSet: { dayInfo: req.body["dayInfo" + String(i)] } }, {upsert: true}, (err, updatedDayInfo) => {
          if (err) {
            console.log(err);
          } else {
            console.log(updatedDayInfo);
          }
        })
        console.log("successfully updated day " + i );
      }
    }
  })
  res.redirect("/admin/tours/" + req.params.id  + "/dayinfo/images" );
});

// redirected from tours/:id/dayinfo
router.get("/admin/tours/:id/dayinfo/images", isLoggedIn, (req, res) => {
  page.title = "Insert Images"
  Tour.findById(req.params.id, (err, tour)=> {
    if (err){
      console.log(err)
    } else {
      console.log(tour)
      res.render("images", {tour: tour, page:page});
    }
  })

});

// Route for admin options
router.get("/admin/options", isLoggedIn, (req, res) => {
  page.title = "Administrative options"
  res.render("admin-options", {page: page});
});
// add/update images pertaining to days of specific tour
router.put("/admin/tours/:id/dayinfo/images", isLoggedIn, (req, res) => {

  // function for creating list of field images and Ids
  var createImageList = (id, imageamount, dayNumber, index) => {
    let positionDay = String(index);
    let field = ["dayInfo." + positionDay + ".images"];

    for (let i = 1; i <= imageamount; i++){
      // function updates bulkOptionsList
      ((j)=>{
        let image = req.body['images' + dayNumber + String(j)];

        createBulkOptions (id, image, field);
      })(i)
    } //loop through specied imageamount number and for each number, retrieve req.bodyimage information and add into image list

  };

  // function for creating the options in the bulk write
  var createBulkOptions = (id, image, field) => {
    let option = {
      updateOne:
      {
        filter : { "dayInfo._id": id }, // filter
        update : { $addToSet: { [field] :  image } }, //update
      }
    };

    bulkOptions.push(option);
  };

  // create options to write in bulk
  var bulkOptions = [];

  Tour.findById(req.params.id, (err, tour) => {
    if (err) {
      console.log("error");
    } else {

      // loop through day info
      tour.dayInfo.forEach( (day, index) => {

        // anonymous function that creates a bulklist (just options for bulkwrite)
        ((id, imageamount, dayNumber, index) => {
          return createImageList(id, imageamount, dayNumber, index);
        })(day._id, day.imageamount, day.day, index)

      }) // end of for Each loop

      Tour.bulkWrite (bulkOptions, {upsert: true}).then( res => { res.Updatedaccount } );

      res.redirect("/admin/tours");

    } // end Tour.findByID
  })


}); // end Put route
// SHOW ROUTE individual TOUR page (displaying all of the information)
router.get("/admin/tours/:id", isLoggedIn, (req, res) => {

  Tour.findById(req.params.id, function(err, tour){
    if (err){
      console.log(err);
    } else {
      page.title = tour.title
      res.render("show-admin", {tour: tour, page: page});
    }
  })
});


// UPDATE PUT and get routes for editing a tour
router.get("/admin/tours/:id/edit",  isLoggedIn, (req, res) => {
  Tour.findById(req.params.id, (err, tour) =>{
    if (err) {
      console.log(err);
    } else {
      page.title = "Edit " + tour.title
      console.log(tour)
      res.render("edit", {tour: tour, page: page});
    }
  })
});

router.put("/admin/tours/:id/edit", (req, res) => {

  // function for updating the db
  var dbUpdate = (filter, update, id) => {
    req.body.tour.categories = String(req.body.tour.categories).split(",");
    req.body.tour.locations = String(req.body.tour.locations).split(",");
    Tour.update(filter, update, (err, tourupdated) => {
      if (err){
        console.log(err);
      } else{
        console.log("you updated the general info of the email, now proceed to add the information related to the tour");

        // calling updated function and then rendering it
        tour(id);
      }
    });

  }

  // function for finding tour in question and rendering it
  let tour = (id) => {
    Tour.findById(id, (err, tour) => {
      if (err){
        console.log(err);
      } else {
        res.redirect("/admin/tours/" + tour._id + "/edit/dayinfo")
      }
    });
  }
  // update tour body to db, call updated instance and render it to edit/dayinfo
  dbUpdate({_id: req.params.id}, req.body.tour, req.params.id);


});

router.get("/admin/tours/:id/edit/dayinfo", (req, res) => {

  Tour.findById(req.params.id, (err, tour) => {
      if (err) {
        console.log(err);
      } else {
        page.title = "Information pertaining to days of " + tour.title
        res.render('edit-dayinfo', {tour:tour, page: page});
      }
  })
});

router.put("/admin/tours/:id/edit/dayinfo",  isLoggedIn, (req, res) => {

  // bulk Options list
  let bulkWriteOptions = [];

  // funnction for creating and pushing options for the bulkwrite function
  let createBulkWriteList = (tour, index, field, value, operator) => {

    let option =  {
      updateOne:
      {
        filter: {_id: tour._id}, //filter
        update: { [operator] : { [field] : value } }  //operator, field and data
      }
    }

    bulkWriteOptions.push(option);
  }

  // function for bulkwrite
  let updateDb = (options, flag) => {Tour.collection.bulkWrite(options, flag).then(
    res => {
      res.Updatedaccount
    }
  )};

  // function for finding tour in question and rendering it
  let redir = (id) => {
    Tour.findById(id, (err, tour) => {
      if (err){
        console.log(err);
      } else {
        res.redirect ( "/admin/tours/" + tour._id + "/edit/dayinfo/images" )
      }
    });
  }

  // loop through each field to create field
  let fieldCreator = (index, tour) => {

    let fieldList = ['day', 'title','route', 'distance', 'description', 'imageamount'];

      if (index <= tour.dayInfo.length ){
        // console.log(tour.dayInfo.length
        fieldList.forEach( (item) => {
          field = 'dayInfo.' + String(index-1) + "." + item;
          value = req.body["dayInfo"+ String(index-1) + item]
          let operator = '$set'
          createBulkWriteList(tour, index, field, value, operator)
        })

      } else if ( index > tour.dayInfo.length ){
        field = 'dayInfo';
        value = {
          day: req.body["dayInfo"+ String(index-1) + 'day'],
          route: req.body["dayInfo"+ String(index-1) + 'route'],
          distance: req.body["dayInfo"+ String(index-1) + 'distance'],
          description: req.body["dayInfo"+ String(index-1) + 'description'],
          imageamount: req.body["dayInfo"+ String(index-1) + 'imageamount'],
          images: []
        }
        let operator = '$push';
        createBulkWriteList(tour, index, field, value, operator);
    }

  };

  // find tour, create bulklist, bulkwrite and redirict
  let findBulkAndUpdate = (id, flag) => {
    Tour.findById(id, (err, tour) => {
      if (err) {
        console.log(err)
      } else {

        for (let index = 1; index <= tour.duration; index++){

          // field
          let field = "";
          let value = "";

          fieldCreator(index, tour);
        };
        updateDb(bulkWriteOptions, flag);
      }
      redir(id);
    })};

  // call function to update everything
  findBulkAndUpdate (req.params.id, {upsert: true});

});

router.get("/admin/tours/:id/edit/dayinfo/images",  isLoggedIn, (req, res) => {

  Tour.findById(req.params.id, (err, tour) => {
    page.title = tour.title
    if (err){
      console.log(err);
    } else {
      page.title = "Images of the different days of the " + tour.title + " tour"
      res.render('edit-dayinfo-images', {tour: tour, page: page})
    }
  });
});

router.put("/admin/tours/:id/edit/dayinfo/images",  isLoggedIn, (req, res) => {

  // list for bulkWriting update options
  let bulkWriteOptionsList = [];

  // function for creating the options in the bulk write
  let createBulkWriteList = (tour, operator, field, image) => {
    let option = {
      updateOne:
      {
        filter : { _id : tour._id }, // filter
        update : { [operator] : { [field] :  image } }, //update
      }
    };

     bulkWriteOptionsList.push(option);
  };

  // function for creating list of field images and Ids
  let createField = (tour, day, index) => {

    for (let j = 1; j <= day.imageamount; j++){
      // if j is less then day.image length --> then create set option and push to list
      if (j <= day.images.length){

        // create bulk option
        let operator = '$set';
        let field = ["dayInfo." + index + ".images." + String(j-1)];
        let image = req.body['images' + day.day + String(j)];

        // push bulkoption to lis
        createBulkWriteList (tour, operator, field, image)

      } else if (j > day.images.length) {

        // create bulk option
        let operator = '$push'
        let field = ["dayInfo." + index + ".images"];
        let image = req.body['images' + day.day + String(j)];

        // push bulkoption to lis
        createBulkWriteList (tour, operator, field, image)

      }
    }
  }

  let updateDb = (bulkWriteOptionsList, flag) => {
    Tour.bulkWrite (bulkWriteOptionsList, flag).then( res => { blukWriteOptionsList.forEach( (option)=>{
      res.Updatedaccount })})
    }

  Tour.findById(req.params.id, (err, tour) => {
    if (err) {
      console.log(err);
    } else {

      // loop through day info
      tour.dayInfo.forEach( (day, index) => {


        createField(tour, day, index);


      }) // end of for Each loop
      updateDb(bulkWriteOptionsList, {upsert: true})
      res.redirect("/admin/tours");
    } // end Tour.findByID

  })

});



// Route for deleting Tours:
router.delete('/admin/tours/:id/delete', isLoggedIn,(req, res) => {
  // destroy blog
  Tour.findByIdAndRemove(req.params.id, (err, deletedTour) => {
    if (err){
      console.log(err);
    } else {

      res.redirect("/admin/tours");
    }
  })
});

module.exports = router;
