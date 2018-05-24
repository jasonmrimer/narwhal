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
import { WebRepositories } from '../utils/Repositories';

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
        <Route exact={true} path="/flights" render={() => <FlightsPage repositories={WebRepositories}/>}/>
        <Route path="/flights/new" render={({history}) => <AirmanProfilePage history={history}/>}/>
        <Route
          path="/flights/:airmanId"
          render={({match, history}) => <AirmanProfilePage airmanId={match.params.airmanId} history={history}/>}
        />
        <Route
          exact={true}
          path="/certifications/new"
          render={({history}) => {
            return (<CertificationManagerPage history={history}/>);
          }}
        />
        <Route
          path="/certifications/:certificationId"
          render={({match, history}) => {
            return (
              <CertificationManagerPage certificationId={match.params.certificationId} history={history}/>
            );
          }}
        />
        <Route exact={true} path="/admin" render={() => <AdminPage/>}/>
      </Switch>
    );
  }
}
