const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RaceSchema = new Schema({
  name: {
    type: String
  },
  racetype: {
    type: String
  },
  event_id: {
    // TODO: do I want IDs to be Numbers or Strings...
    type: String
  },
  raceday_id: {
    // TODO: do I want IDs to be Numbers or Strings...
    type: String
  },
  loc_name: {
    type: String
  },
  loc_address: {
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
  day: {
    // TODO: Might change this, make the date the actual date...
    // Which makes more sense than the way they have it set up...
    type: String
  },
  last_updated: {
    type: Date
  }
});

module.exports = Race = mongoose.model("races", RaceSchema);

/* Data I want for site
  jsonRaces[i].event_name
  jsonRaces[i].subevents.category.category_name
  jsonRaces[i].subevents.parent_event_id
  jsonRaces[i].subevents.id
  jsonRaces[i].subevents.venue.address
  jsonRaces[i].subevents.venue.city
  jsonRaces[i].subevents.venue.state
  jsonRaces[i].subevents.venue.zip
  jsonRaces[i].subevents.venue.country
  jsonRaces[i].subevents.venue.latitude
  jsonRaces[i].subevents.venue.longitude
  jsonRaces[i].subevents.venue.name
  jsonRaces[i].subevents.start_date
  jsonRaces[i].subevents.end_date
  jsonRaces[i].subevents.ct_event_id.{objects}

  */
