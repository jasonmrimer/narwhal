import * as React from 'react';

import Roster from './roster/Roster';
import RosterRepository from './roster/WebRosterRepository';

export default class App extends React.Component {
  render() {
    return ( <Roster rosterRepository={new RosterRepository()}/> );
  }
}
