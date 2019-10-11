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
    let msg = "Success?";
    let count = 0;
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
                        let racetype =
                            jsonRaces[event].subevents[subevent].category.category_name;
                        if (
                            racetype == "Sprint" ||
                            racetype == "Beast" ||
                            racetype == "Ultra" ||
                            racetype == "Stadion" ||
                            racetype == "Super"
                        ) {
                            for (var raceday in jsonRaces[event].subevents[subevent]
                                .ct_event_id) {
                                let raceday_id =
                                    jsonRaces[event].subevents[subevent].ct_event_id[raceday]
                                        .event;
                                let day =
                                    jsonRaces[event].subevents[subevent].ct_event_id[raceday].day;
                                /*
                                Race.findOne({ raceday_id })
                                  .then(race => {
                                    if (race) {
                                      // race is already in the system
                                      console.log(`${race} already exists`);
                                    } else {
                                      const newRace = new Race({
                                        name: jsonRaces[event].event_name,
                                        racetype:
                                          jsonRaces[event].subevents[subevent].category
                                            .category_name,
                                        event_id:
                                          jsonRaces[event].subevents[subevent].parent_event_id,
                                        raceday_id:
                                          jsonRaces[event].subevents[subevent].ct_event_id[
                                            raceday
                                          ].event,
                                        loc_name:
                                          jsonRaces[event].subevents[subevent].venue.name,
                                        loc_address:
                                          jsonRaces[event].subevents[subevent].venue.address,
                                        loc_city:
                                          jsonRaces[event].subevents[subevent].venue.city,
                                        loc_state:
                                          jsonRaces[event].subevents[subevent].venue.state,
                                        loc_zip: jsonRaces[event].subevents[subevent].venue.zip,
                                        loc_country:
                                          jsonRaces[event].subevents[subevent].venue.country,
                                        date: new Date(
                                          jsonRaces[event].subevents[subevent].start_date
                                        ),
                                        day,
                                        last_updated: Date.now()
                                      });
                                      count++;
                                      newRace
                                        .save()
                                        .then()
                                        .catch(err => console.log(err));
                                    }
                                  })
                                  .catch(err => console.log(err));
                                  */
                                const newRace = new Race({
                                    name: jsonRaces[event].event_name,
                                    racetype:
                                        jsonRaces[event].subevents[subevent].category.category_name,
                                    event_id:
                                        jsonRaces[event].subevents[subevent].parent_event_id,
                                    raceday_id:
                                        jsonRaces[event].subevents[subevent].ct_event_id[raceday]
                                            .event,
                                    loc_name: jsonRaces[event].subevents[subevent].venue.name,
                                    loc_address:
                                        jsonRaces[event].subevents[subevent].venue.address,
                                    loc_city: jsonRaces[event].subevents[subevent].venue.city,
                                    loc_state: jsonRaces[event].subevents[subevent].venue.state,
                                    loc_zip: jsonRaces[event].subevents[subevent].venue.zip,
                                    loc_country:
                                        jsonRaces[event].subevents[subevent].venue.country,
                                    date: new Date(
                                        jsonRaces[event].subevents[subevent].start_date
                                    ),
                                    day,
                                    last_updated: Date.now()
                                });
                                count++;
                                newRace
                                    .save()
                                    .then()
                                    .catch(err => console.log(err));
                            }
                        }
                    }
                }
            }

            return res.json({ msg, count });
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
