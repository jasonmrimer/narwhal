import * as React from 'react';
import WebAirmanRepository from './roster/repositories/WebAirmanRepository';
import Tracker from './tracker/Tracker';
import WebUnitRepository from './tracker/respositories/WebUnitRepository';

export default class App extends React.Component {
  render() {
    return (
      <Tracker
        airmanRepository={new WebAirmanRepository()}
        unitRepository={new WebUnitRepository()}
      />
    );
  }
}
