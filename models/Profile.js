const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  location: {
    // This may be a different type depending on what Google Maps wants
    // TODO: determine this!!
    type: String
  },
  races: {
    // TODO: should this be an array of numbers?
    // Could use race IDs instead...
    type: [String]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
