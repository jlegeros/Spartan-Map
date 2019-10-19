import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import keys from "../../config/keys";

class RaceMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      errors: {}
    };
  }
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
            zoom={4.5}
            initialCenter={{ lat: 37.6, lng: -95.665 }}
          >
            <Marker
              title={"The marker`s title will appear as a tooltip."}
              name={"SOMA"}
              position={{ lat: 37.778519, lng: -122.40564 }}
            />
          </Map>
        </div>
      </div>
    );
  }
}
/*
RaceMap.propTypes = {
  races: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  races: state.races,
  errors: state.errors
});
*/

export default GoogleApiWrapper({
  apiKey: keys.googleMapsAPIKey
})(RaceMap);
