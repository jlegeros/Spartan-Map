const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const fetch = require("node-fetch");

const Race = require("../../models/Race");

router.get("/test", (req, res) => res.json({ msg: "Map works" }));

// @route   POST api/map/test-get-races
// @desc    Tests populating the race database...
// @access  Private
router.post("/test-get-races", (req, res) => {
  let msg = "Success";
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

      for (var event in jsonRaces) {
        // if (jsonRaces[event].venue.country === "USA") {
        if (true) {
          for (var subevent in jsonRaces[event].subevents) {
            let spartanEvent = jsonRaces[event].subevents[subevent];
            let racetype = spartanEvent.category.category_name;
            if (
              racetype == "Sprint" ||
              racetype == "Beast" ||
              racetype == "Ultra" ||
              racetype == "Stadion" ||
              racetype == "Super"
            ) {
              for (var raceday in spartanEvent.ct_event_id) {
                let name = jsonRaces[event].event_name;
                let event_id = spartanEvent.parent_event_id;
                let raceday_id = spartanEvent.ct_event_id[raceday].event;
                let loc_name = spartanEvent.venue.name;
                let loc_address = spartanEvent.venue.address;
                let loc_city = spartanEvent.venue.city;
                let loc_state = spartanEvent.venue.state;
                let loc_zip = spartanEvent.venue.zip;
                let loc_country = spartanEvent.venue.country;
                let date = new Date(spartanEvent.start_date);
                let day = spartanEvent.ct_event_id[raceday].day;

                Race.findOne({ raceday_id })
                  .then(race => {
                    if (race) {
                      // race is already in the system
                      // TODO: Diff the data, update if necessary
                      console.log(`${race.name} already exists`);
                    } else {
                      const newRace = new Race({
                        name,
                        racetype,
                        event_id,
                        raceday_id,
                        loc_name,
                        loc_address,
                        loc_city,
                        loc_state,
                        loc_zip,
                        loc_country,
                        date,
                        day,
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

      return res.json({ msg });
    });
});

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
