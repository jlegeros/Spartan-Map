const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Map works" }));

// @route   GET api/map/test
// @desc    Tests map route
// @access  Public
module.exports = router;
