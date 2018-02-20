import * as React from 'react';
import { StyledTracker } from '../tracker/Tracker';
import ProfileRepository from '../profile/repositories/ProfileRepository';
import { StyledDashboard } from '../dashboard/Dashboard';
import { Route, Switch } from 'react-router-dom';
import { StyledCrew } from '../crew/Crew';
import { CrewStore } from '../crew/stores/CrewStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { Upload } from '../upload/Upload';
import { ProfileModel } from '../profile/models/ProfileModel';

interface Props {
  profileRepository: ProfileRepository;
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  crewStore: CrewStore;
}

interface State {
  profile: ProfileModel | null;
}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profile: null
    };
  }

  async componentDidMount() {
    const profile = await this.props.profileRepository.findOne();
    this.setState({profile});
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
        {
          this.state.profile != null &&
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
                    username={this.state.profile!.username}
                    dashboardStore={this.props.dashboardStore}
                  />
                );
              }}
            />

            <Route
              path="/crew/:id"
              render={({match}) => {
                return (
                  <StyledCrew
                    crewId={match.params.id}
                    crewStore={this.props.crewStore}
                  />
                );
              }}
            />

            <Route
              path="/"
              render={() => {
                return (
                  <StyledTracker
                    profile={this.state.profile!}
                    trackerStore={this.props.trackerStore}
                  />
                );
              }}
            />
          </Switch>
        }
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
