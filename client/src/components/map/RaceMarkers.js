/* 
  Not current being used...
*/

import React, { Component } from "react";
import { Marker } from "google-maps-react";
import { getRaces } from "../../actions/raceActions";

class RaceMarkers extends Component {
  constructor() {
    super();
    this.state = {
      races: [],
      errors: {}
    };
  }

  render() {
    return (
      <Marker
        title={"Working on it, checking state..."}
        name={"SOMA"}
        position={{ lat: 37.778519, lng: -122.40564 }}
      />
    );
  }
}

export default RaceMarkers;
