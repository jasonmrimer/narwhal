import * as React from 'react';
import Tracker from '../tracker/Tracker';
import ProfileRepository from '../profile/repositories/ProfileRepository';
import AirmanRepository from '../airman/repositories/AirmanRepository';
import UnitRepository from '../unit/repositories/UnitRepository';
import { MomentPlannerService } from '../tracker/services/MomentPlannerService';
import Dashboard from '../dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';
import MissionRepository from '../mission/repositories/MissionRepository';
import SiteRepository from '../site/repositories/SiteRepository';

interface Props {
  profileRepository: ProfileRepository;
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
  missionRepository: MissionRepository;
  siteRepository: SiteRepository;
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
              missionRepository={this.props.missionRepository}
              siteRepository={this.props.siteRepository}
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
                    airmanRepository={this.props.airmanRepository}
                    unitRepository={this.props.unitRepository}
                    plannerService={new MomentPlannerService()}
                />
            );
          }}
        />
        </Switch>
      </div>
    );
  }
}
