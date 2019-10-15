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
