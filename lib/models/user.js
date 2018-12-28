//  require mongoose
let mongoose          = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose);

// model for test-database
module.exports = mongoose.model("User", userSchema);
