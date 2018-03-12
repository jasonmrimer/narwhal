import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CrewStore } from '../crew/stores/CrewStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import styled from 'styled-components';
import { StyledTracker } from '../tracker/Tracker';
import { StyledTopBar } from './TopBar';
import { Upload } from '../upload/Upload';
import { StyledDashboard } from '../dashboard/Dashboard';
import { StyledCrew } from '../crew/Crew';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { observer } from 'mobx-react';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';

interface Props {
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  crewStore: CrewStore;
  profileStore: ProfileSitePickerStore;
}

@observer
export class App extends React.Component<Props> {
  async componentDidMount() {
    await this.props.profileStore.hydrate();
  }

  render() {
    return (
      <div>
        {
          this.props.profileStore.profile != null &&
          <div>
            <StyledClassificationBanner classified={this.props.profileStore.profile!.classified}/>
            <StyledAuthorizationBanner/>
            <div style={{marginTop: '8rem'}}>
              {
                this.profileHasSite() ?
                  this.renderApp() :
                  <StyledProfileSitePicker profileStore={this.props.profileStore}/>
              }
            </div>
          </div>
        }
      </div>
    );
  }

  private renderApp() {
    return (
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
                  username={this.props.profileStore.profile!.user.username}
                  pageTitle="MPS DASHBOARD"
                />,
                <StyledDashboard
                  key="1"
                  username={this.props.profileStore.profile!.user.username}
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
          exact={true}
          path="/"
          render={() => {
            return [
              <StyledTopBar
                key="0"
                username={this.props.profileStore.profile!.user.username}
                pageTitle="AVAILABILITY ROSTER"
              />,
              <StyledTracker
                key="1"
                profile={this.props.profileStore.profile!.user}
                trackerStore={this.props.trackerStore}
              />
            ];
          }}
        />
      </Switch>
    );
  }

  private profileHasSite() {
    return this.props.profileStore.profile!.user.siteId != null;
  }
}

export const ClassificationBanner = (props: { classified: boolean, className?: string }) => {
  return (
    <div className={props.className}>
      {props.classified ?
        'Dynamic Classification Highest Possible Classification: TS//SI//REL TO USA, FVEY' :
        'Not Actual Classification. Prototype Only'
      }
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
