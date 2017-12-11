import * as React from 'react';
import WebRosterRepository from './roster/repositories/WebRosterRepository';
import Tracker from './tracker/Tracker';
import WebUnitRepository from './tracker/respositories/WebUnitRepository';

export default class App extends React.Component {
  render() {
    return (
      <Tracker
        rosterRepository={new WebRosterRepository()}
        unitRepository={new WebUnitRepository()}
      />
    );
  }
}
