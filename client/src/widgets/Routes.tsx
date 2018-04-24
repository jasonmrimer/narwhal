import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Upload as UploadPage } from '../upload/Upload';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { observer } from 'mobx-react/custom';
import { TrackerPage } from './pages/TrackerPage';
import { CrewPage } from './pages/CrewPage';
import { DashboardPage } from './pages/DashboardPage';
import { MissionPlannerStore } from '../crew/stores/MissionPlannerStore';
import { AdminPage } from './pages/AdminPage';
import { AdminStore } from '../admin/stores/AdminStore';
import { FlightsPage } from './pages/FlightsPage';
import { SiteManagerStore } from '../site-manager/stores/SiteManagerStore';
import { AirmanProfilePage } from './pages/AirmanProfilePage';
import { AirmanProfileManagerStore } from '../site-manager/stores/AirmanProfileManagerStore';

interface Props {
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  missionPlannerStore: MissionPlannerStore;
  profileStore: ProfileSitePickerStore;
  adminStore: AdminStore;
  siteManagerStore: SiteManagerStore;
  airmanProfileManagerStore: AirmanProfileManagerStore;
}

@observer
export class Routes extends React.Component<Props> {
  render() {
    const profile = this.props.profileStore.profile!;
    return (
      <Switch>
        <Route exact={true} path="/" render={() => <TrackerPage {...this.props}/>}/>
        <Route path="/upload" render={() => <UploadPage/>}/>
        <Route exact={true} path="/dashboard" render={() => <DashboardPage {...this.props}/>}/>
        <Route
          path="/dashboard/crew/:id"
          render={({match}) => {
            return (
              <CrewPage
                profile={profile}
                crewId={match.params.id}
                missionPlannerStore={this.props.missionPlannerStore}
              />
            );
          }}
        />
        <Route exact={true} path="/admin" render={() => <AdminPage {...this.props}/>}/>
        <Route exact={true} path="/flights" render={() => <FlightsPage {...this.props}/>}/>
        <Route
          path="/flights/:airmanId"
          render={({match}) => {
            return (
            <AirmanProfilePage
              airmanProfileManagerStore={this.props.airmanProfileManagerStore}
              airmanId={match.params.airmanId}
              profile={profile}
            />
            );
          }}
        />
      </Switch>
    );
  }
}