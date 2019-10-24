const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema({
  name: {
    type: String
  },
  event_id: {
    // TODO: do I want IDs to be Numbers or Strings...
    type: String
  },
  loc_name: {
    type: String
  },
  loc_address: {
    type: String
  },
  loc_latitude: {
    type: String
  },
  loc_longitude: {
    type: String
  },
  loc_city: {
    type: String
  },
  loc_state: {
    type: String
  },
  loc_zip: {
    type: String
  },
  loc_country: {
    type: String
  },
  date: {
    type: Date
  },
  last_updated: {
    type: Date
  }
});

module.exports = Event = mongoose.model("events", EventSchema);
