//  require mongoose
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema; 
passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose);

// model for test-database
module.exports = mongoose.model("User", userSchema);
