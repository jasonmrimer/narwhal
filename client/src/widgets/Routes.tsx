import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Upload as UploadPage } from '../upload/Upload';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { CrewStore } from '../crew/stores/CrewStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { observer } from 'mobx-react/custom';
import { TrackerPage } from './pages/TrackerPage';
import { CrewPage } from './pages/CrewPage';
import { DashboardPage } from './pages/DashboardPage';

interface Props {
  dashboardStore: DashboardStore;
  trackerStore: TrackerStore;
  crewStore: CrewStore;
  profileStore: ProfileSitePickerStore;
}

@observer
export class Routes extends React.Component<Props> {
  render() {
    return (
      <Switch>
        <Route exact={true} path="/" render={() => <TrackerPage {...this.props}/>}/>
        <Route path="/upload" render={() => <UploadPage/>}/>
        <Route path="/dashboard" render={() => <DashboardPage {...this.props}/>}/>
        <Route path="/crew/:id" render={({match}) => <CrewPage {...this.props} crewId={match.params.id}/>}/>
      </Switch>
    );
  }
}