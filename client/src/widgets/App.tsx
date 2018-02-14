import * as React from 'react';
import { StyledTracker } from '../tracker/Tracker';
import ProfileRepository from '../profile/repositories/ProfileRepository';
import { StyledDashboard } from '../dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { Upload } from '../upload/Upload';

interface Props {
  profileRepository: ProfileRepository;
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
}

interface State {
  username: string;
}

export class App extends React.Component<Props, State> {
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
        <div
          className="authorization-banner"
          style={authorizationBanner}
        >
          Authorized Personnel Only
        </div>
        <Switch>
          <Route
            path="/upload"
            render={() => {
              return <Upload/>;
            }}
          />

          <Route
            path="/dashboard"
            render={() => {
              return (
                <StyledDashboard
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
                <StyledTracker
                  username={this.state.username}
                  trackerStore={this.props.trackerStore}
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

const authorizationBanner = {
  background: '#5C6977',
  textAlign: 'center',
  paddingBottom: '0.25rem',
};
