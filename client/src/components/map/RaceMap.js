import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import keys from "../../config/keys";
import { getRaces } from "../../actions/raceActions";
import axios from "axios";

class RaceMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      errors: {}
    };
  }

  componentDidMount() {
    this._getRaces();
  }

  _getRaces = async () => {
    const races = await getRaces();
    this.setState({
      errors: {},
      races
    });
  };

  renderMarkers = () => {
    if (this.state.races.length > 0) {
      return this.state.races.map(race => {
        return (
          <Marker
            title={race.name}
            name={race.name}
            position={{ lat: race.loc_latitude, lng: race.loc_longitude }}
            key={race._id}
            icon={
              "https://www.spartan.com/images/logos/red-map-marker-54x67.png"
            }
          />
        );
      });
    } else
      return (
        <Marker
          title={"Boston, home of Spartan HQ"}
          name={"Boston, MA"}
          position={{ lat: 42.3142643, lng: -71.1107101 }}
        />
      );
  };

  render() {
    const mapStyles = {
      display: "inline",
      position: "relative",
      width: "100%",
      height: "80vh"
    };
    return (
      <div className="container">
        <div className="row">
          <Map
            google={this.props.google}
            containerStyle={mapStyles}
            zoom={4.2}
            initialCenter={{ lat: 37.6, lng: -95.665 }}
            mapTypeId={"terrain"}
          >
            {this.renderMarkers()}
            {/* <RaceMarkers /> */}
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: keys.googleMapsAPIKey
})(RaceMap);
