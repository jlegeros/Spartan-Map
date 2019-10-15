const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fetch = require("node-fetch");

const Race = require("../../models/Race");

// @route   GET api/map/test
// @desc    Tests the map route...
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Map works" }));

module.exports = router;

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
