import * as React from 'react';
import Tracker from '../tracker/Tracker';
import ProfileRepository from '../profile/repositories/ProfileRepository';
import { MomentPlannerService } from '../tracker/services/MomentPlannerService';
import Dashboard from '../dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';
import EventRepository from '../event/repositories/EventRepository';
import { SquadronStore } from '../squadron/SquadronStore';
import { AirmanStore } from '../airman/AirmanStore';
import { CertificationStore } from '../airman/CertificationStore';
import { FlightStore } from '../flight/FlightStore';
import { SiteStore } from '../site/SiteStore';
import { MissionStore } from '../mission/MissionStore';

interface Props {
    airmanStore: AirmanStore;
    certificationStore: CertificationStore;
    squadronStore: SquadronStore;
    profileRepository: ProfileRepository;
    flightStore: FlightStore;
    missionStore: MissionStore;
    siteStore: SiteStore;
    eventRepository: EventRepository;
}

interface State {
  username: string;
}

export default class App extends React.Component<Props, State> {
  state = {
    username: ''
  };

  async componentDidMount() {
    const {username} = await this.props.profileRepository.findOne();
    this.setState({username});
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            path="/dashboard"
            render={() => {
              return (
                <Dashboard
                  username={this.state.username}
                  missionStore={this.props.missionStore}
                  siteStore={this.props.siteStore}
                />
              );
            }}
          />

          <Route
            path="/"
            render={() => {
              return (
                <Tracker
                  username={this.state.username}
                  airmanStore={this.props.airmanStore}
                  squadronStore={this.props.squadronStore}
                  certificationStore={this.props.certificationStore}
                  eventRepository={this.props.eventRepository}
                  plannerService={new MomentPlannerService()}
                  flightStore={this.props.flightStore}
                />
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}
