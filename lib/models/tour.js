const mongoose = require('mongoose');
const Schema = mongoose.Schema;  

// schema for images
const imageSchema = new Schema(
  {
    title: String,
    description: String,
    link: String
  }
);

// shema lower for the tes dictionary
const daysSchema = new Schema({
  day: Number,
  title: String,
  route: String,
  distance: Number,
  description: String,
  imageamount: Number,
  images: [imageSchema],

})

// schema upper for the test dictionary
const tourSchema  = new Schema({
  date: String,
  thumbnail: String,
  categories: Array,
  title: String,
  locations: Array,
  duration: Number,
  generalDescription: String,
  dayInfo: Array(daysSchema),
});

// model for test-database
module.exports = mongoose.model("Tour", tourSchema);
