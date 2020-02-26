import React, { Component } from 'react'
import { getRacesUS } from "../../actions/raceActions";

import "../../styles/RaceList.css";

class RaceList extends Component {
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
    const races = await getRacesUS();
    this.setState({
      errors: {},
      races
    });
  };

  render() {
    return (
      <div className="event-container">
      {this.state.races.map((event, i) => (
          <div className="spartan-event">
            <span className="event-name">
              {event.name} {event.start_date} {event.loc_lat} {event.loc_long}
            </span>
          </div>
      ))}
      </div>
    )
  }
}

export default RaceList;
