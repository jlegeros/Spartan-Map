const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fetch = require("node-fetch");

const Race = require("../../models/Race");
const Event = require("../../models/Event");

// @route   POST api/races/test-get-races
// @desc    Tests populating the race database...
// @access  Public TODO: make Private, admin only?
router.post("/test-get-races", (req, res) => {
  // cannot find a data feed containing races, but the spartan race page has a JSON object
  // in its html source containing all their races...  so, I fetch the html source
  // cut out the parts that I don't need, then parse the string as a JSON object
  // if the source layout changes, this will need to be updated
  let msg = "Success";
  fetch("https://www.spartan.com/en/race/find-race")
    .then(res => res.text())
    .then(body => {
      let htmlArr = body.split(`<script type="text/javascript">`);
      htmlArr = htmlArr[1].split(`</script>`);
      htmlArr = htmlArr[0].split(`window.races = `);

      let jsonRaces = JSON.parse(
        htmlArr[1].substring(0, htmlArr[1].trim().length - 1)
      );

      for (let event in jsonRaces) {
        for (let subevent in jsonRaces[event].subevents) {
          let spartanEvent = jsonRaces[event].subevents[subevent];
          let racetype = spartanEvent.category.category_name;
          if (
            racetype == "Sprint" ||
            racetype == "Beast" ||
            racetype == "Ultra" ||
            racetype == "Stadion" ||
            racetype == "Super"
          ) {
            // Make an event here
            let event_id = spartanEvent.parent_event_id;
            Event.findOne({ event_id }).then(event => {
              if (event) {
                // Event is already in the system
                // TODO: Diff the data, update if necessary
                console.log(`${event.name} already exists`);
              } else {
                const newEvent = new Event({
                  name: jsonRaces[event].event_name,
                  event_id,
                  loc_name: spartanEvent.venue.name,
                  loc_address: spartanEvent.venue.address,
                  loc_latitude: spartanEvent.venue.latitude,
                  loc_longitude: spartanEvent.venue.longitude,
                  loc_city: spartanEvent.venue.city,
                  loc_state: spartanEvent.venue.state,
                  loc_zip: spartanEvent.venue.zip,
                  loc_country: spartanEvent.venue.country,
                  date: new Date(spartanEvent.start_date),
                  last_updated: Date.now()
                });
                newEvent
                  .save()
                  .then()
                  .catch(err => console.log(err));
              }
            });
            for (let raceday in spartanEvent.ct_event_id) {
              let raceday_id = spartanEvent.ct_event_id[raceday].event;

              Race.findOne({ raceday_id })
                .then(race => {
                  if (race) {
                    // race is already in the system
                    // TODO: Diff the data, update if necessary
                    console.log(`${race.name} already exists`);
                  } else {
                    // TODO: Fix date based on day for multi day events...
                    const newRace = new Race({
                      name: jsonRaces[event].event_name,
                      racetype,
                      event_id: spartanEvent.parent_event_id,
                      raceday_id,
                      date: new Date(spartanEvent.start_date),
                      day: spartanEvent.ct_event_id[raceday].day,
                      last_updated: Date.now()
                    });
                    newRace
                      .save()
                      .then()
                      .catch(err => console.log(err));
                  }
                })
                .catch(err => console.log(err));
            }
          }
        }
      }

      return res.json(msg);
    });
});

// @route   GET api/races/events
// @desc    Gets all race events in USA
// @access  Public
router.get("/events", (req, res) => {
  const errors = {};
  Event.find({ loc_country: "USA" })
    .sort({ date: 1 })
    .then(events => {
      if (!events) {
        errors.noevents = "There are no events";
        return res.status(404).json(errors);
      }
      res.json(events);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/races/id/:raceday_id
// @desc    Gets a race by raceday_id
// @access  Public
router.get("/id/:raceday_id", (req, res) => {
  const errors = {};
  Race.findOne({ raceday_id: req.params.raceday_id })
    .then(race => {
      if (!race) {
        errors.norace = "There is no race with that id";
        return res.status(404).json(errors);
      }
      res.json(race);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/races/event/:event_id
// @desc    Gets all races occuring at an event by event_id
// @access  Public
router.get("/event/:event_id", (req, res) => {
  const errors = {};
  Race.find({ event_id: req.params.event_id })
    .sort({ date: 1 })
    .then(races => {
      if (!races) {
        errors.noraces = "There are no races with that event id";
        return res.status(404).json(errors);
      }
      res.json(races);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/races/get-sunday-races
// @desc    gets all races on Sunday in USA
// @access  Public
router.get("/get-sunday-races", (req, res) => {
  Race.find({ day: "Sunday", loc_country: "USA" })
    .sort({ date: 1 })
    .then(races => {
      let events = [];
      for (let i in races) {
        events[i] = `${races[i].date} ${races[i].racetype} ${races[i].day}`;
      }
      return res.json(races);
    })
    .catch(err => res.status(400).json(err));
});

// @route   GET api/races/get-friday-races
// @desc    gets all races on Friday in USA
// @access  Public
router.get("/get-friday-races", (req, res) => {
  Race.find({ day: "Friday" })
    .sort({ date: 1 })
    .then(races => {
      let events = [];
      for (let i in races) {
        events[i] = `${races[i].date} ${races[i].racetype} ${races[i].day}`;
      }
      return res.json(races);
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
