import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import keys from "../../config/keys";
import { getRacesUS } from "../../actions/raceActions";
import axios from "axios";
import SpartanIcon from "./red-map-marker.png";

class RaceMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      center: { lat: 37.6, lng: -95.665 },
      activeMarker: {},
      activeEventName: "",
      errors: {}
    };
  }

  componentDidMount() {
    this._getRaces();
  }

  _getRaces = async () => {
    const races = await getRacesUS();
    this.setState({
      errors: {},
      races
    });
  };

  onClick = (e) => {
    console.log(e.name);
    this.setState({
      center: e.position,
      activeMarker: e.position,
      activeEventName: e.name,
    });
  }

  onMouseOver = (e) => {
    console.log(e.name);
  }

  renderMarkers = () => {
    if (this.state.races.length > 0) {
      return this.state.races.map(race => {
        return (
          <Marker
            title={race.name}
            onClick={this.onClick}
            onMouseOver={this.onMouseOver}
            name={race.name}
            position={{ lat: race.loc_lat, lng: race.loc_long }}
            key={race.id}
            icon={SpartanIcon}
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
            initialCenter={this.state.center}
            mapTypeId={"terrain"}
          >
            {this.renderMarkers()}
            <InfoWindow 
              position={this.state.activeMarker}
              visible={true}>
              <div>
                {this.state.activeEventName} {this.state.activeEventDate}
              </div>  
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: keys.googleMapsAPIKey
})(RaceMap);
