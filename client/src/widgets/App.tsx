import * as React from 'react';
import Tracker from '../tracker/Tracker';
import ProfileRepository from '../profile/repositories/ProfileRepository';
import { MomentPlannerService } from '../tracker/services/MomentPlannerService';
import Dashboard from '../dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';
import TrackerStore from '../tracker/stores/TrackerStore';
import DashboardStore from '../dashboard/stores/DashboardStore';

interface Props {
  profileRepository: ProfileRepository;
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
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
        <div
          className="classification-banner"
          style={classificationBanner}
        >
          Not Actual Classification. Prototype Only
        </div>
        <Switch>
          <Route
            path="/dashboard"
            render={() => {
              return (
                <Dashboard
                  username={this.state.username}
                  dashboardStore={this.props.dashboardStore}
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
                  trackerStore={this.props.trackerStore}
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

const classificationBanner = {
  background: 'red',
  textAlign: 'center',
  paddingBottom: '0.25rem',
};