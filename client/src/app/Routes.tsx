import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Upload as UploadPage } from '../upload/Upload';
import { observer } from 'mobx-react/custom';
import { TrackerPage } from './pages/TrackerPage';
import { CrewPage } from './pages/CrewPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { FlightsPage } from './pages/FlightsPage';
import { AirmanProfilePage } from './pages/AirmanProfilePage';
import { CertificationManagerPage } from './pages/CertificationManagerPage';

@observer
export class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact={true} path="/" render={() => <TrackerPage/>}/>
        <Route path="/upload" render={() => <UploadPage/>}/>
        <Route exact={true} path="/dashboard" render={() => <DashboardPage/>}/>
        <Route
          path="/dashboard/crew/:id"
          render={({match}) => <CrewPage crewId={match.params.id}/>}
        />
        <Route exact={true} path="/flights" render={() => <FlightsPage/>}/>
        <Route path="/flights/new" render={({history}) => <AirmanProfilePage history={history}/>}/>
        <Route
          path="/flights/:airmanId"
          render={({match, history}) => <AirmanProfilePage airmanId={match.params.airmanId} history={history}/>}
        />
        <Route
          path="/certifications/:certificationId"
          render={({match}) => {
            return (
              <CertificationManagerPage certificationId={match.params.certificationId}/>
            );
          }}
        />
        <Route exact={true} path="/admin" render={() => <AdminPage/>}/>
      </Switch>
    );
  }
}
