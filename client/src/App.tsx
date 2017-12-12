import * as React from 'react';
import WebAirmanRepository from './airman/repositories/web/WebAirmanRepository';
import Tracker from './tracker/Tracker';
import WebUnitRepository from './unit/repositories/web/WebUnitRepository';

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
