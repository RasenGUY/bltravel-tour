const express         = require("express"),
compression           = require('compression')
app                   = express(),
ejsLint               = require('ejs-lint'),
mongoose              = require("mongoose"),
bodyParser            = require("body-parser"),
passport              = require('passport'),
Tour                  = require('./lib/models/tour'),
User                  = require('./lib/models/user'),
methodOverride        = require('method-override'),
nodemailer            = require('nodemailer'),
{google}              = require('googleapis'),
email                 = require('./lib/routes/email.js'),
index                 = require('./lib/routes/admin.js'),
LocalStrategy         = require('passport-local'),
passportLocalMongoose = require('passport-local-mongoose'),
indexRoutes           = require('./lib/routes/index.js'),
adminRoutes           = require('./lib/routes/admin.js'),
emailRoutes           = require('./lib/routes/email.js');



// using modules and adding middleware
app.use(compression());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(require('express-session')({
  secret: "nakai resort is a great place to stay",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(adminRoutes);
app.use(emailRoutes);


// connect to database
// mongoose.connect('mongodb://localhost/bltravel_tour', { useNewUrlParser: true});
mongoose.connect('mongodb://bltravelt:Tan77772911@ds125574.mlab.com:25574/bltravelt', { useNewUrlParser: true});

let port =  process.env.PORT || 3000;
// start up server
app.listen(port, function(){
  console.log("started server");
});
