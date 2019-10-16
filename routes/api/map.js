const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("../../config/keys");

const Race = require("../../models/Race");

// Google Maps Node.js library
const googleMapsClient = require("@google/maps").createClient({
  key: keys.googleMapsAPIKey,
  Promise: Promise
});

// @route   GET api/map/test
// @desc    Tests the map route...
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Map works" }));

// @route   GET api/map/test-distance-matrix
// @desc    Tests the Google Maps distance Matrix function
// @access  Public
router.get("/test-distance-matrix", (req, res) => {
  googleMapsClient
    .distanceMatrix({
      origins: ["Providence, RI"],
      destinations: ["Boston, MA"],
      mode: "driving"
    })
    .asPromise()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
