const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fetch = require("node-fetch");

const Race = require("../../models/Race");

// @route   POST api/races/test-get-races
// @desc    Tests populating the race database...
// @access  Public TODO: make Private, admin only?
router.post("/test-get-races", (req, res) => {
  // cannot find a data feed containing races, but the spartan race page has a JSON object
  // in its html source containing all their races...  so, I fetch the html source
  // cut out the parts that I don't need, then parse the string as a JSON object
  // if the source layout changes, this will need to be updated
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
        // if (jsonRaces[event].venue.country === "USA") {
        if (true) {
          // was filtering by US races, figure I'll just grab it all for now
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
              for (let raceday in spartanEvent.ct_event_id) {
                let raceday_id = spartanEvent.ct_event_id[raceday].event;

                Race.findOne({ raceday_id })
                  .then(race => {
                    if (race) {
                      // race is already in the system
                      // TODO: Diff the data, update if necessary
                      console.log(`${race.name} already exists`);
                    } else {
                      const newRace = new Race({
                        name: jsonRaces[event].event_name,
                        racetype,
                        event_id: spartanEvent.parent_event_id,
                        raceday_id,
                        loc_name: spartanEvent.venue.name,
                        loc_address: spartanEvent.venue.address,
                        loc_city: spartanEvent.venue.city,
                        loc_state: spartanEvent.venue.state,
                        loc_zip: spartanEvent.venue.zip,
                        loc_country: spartanEvent.venue.country,
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
      }

      return res.json({ msg: "Success" });
    });
});

module.exports = router;
