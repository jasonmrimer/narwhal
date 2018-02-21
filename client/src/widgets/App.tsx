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
import styled from 'styled-components';
import { StyledTopBar } from './TopBar';

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
        <StyledClassificationBanner/>
        <StyledAuthorizationBanner/>
        <main style={{marginTop: '8rem'}}>
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
                    [
                      <StyledTopBar
                        key="0"
                        username={this.state.profile!.username}
                        pageTitle="MPS DASHBOARD"
                      />,
                      <StyledDashboard
                        key="1"
                        username={this.state.profile!.username}
                        dashboardStore={this.props.dashboardStore}
                      />
                    ]
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
                    [
                      <StyledTopBar
                        key="0"
                        username={this.state.profile!.username}
                        pageTitle="AVAILABILITY ROSTER"
                      />,
                      <StyledTracker
                        key="1"
                        profile={this.state.profile!}
                        trackerStore={this.props.trackerStore}
                      />
                    ]
                  );
                }}
              />
            </Switch>
          }
        </main>
      </div>
    );
  }
}

const ClassificationBanner = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      Not Actual Classification. Prototype Only
    </div>
  );
};

const StyledClassificationBanner = styled(ClassificationBanner)`
  background: red;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 1.5rem;
  top: 0;
  z-index: 1000;
`;

const AuthorizationBanner = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      Authorized Personnel Only
    </div>
  );
};

const StyledAuthorizationBanner = styled(AuthorizationBanner)`
  background: #5C6977;
  text-align: center;
  position: fixed;
  top: 1.5rem;
  height: 1.5rem;
  width: 100%;
  z-index: 1000;
`;
