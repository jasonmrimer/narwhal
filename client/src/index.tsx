import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import { App, InjectedApp } from './widgets/App';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from './themes/default';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'mobx-react';
import { stores } from './stores';
import { withRouter } from 'react-router';
import { WebRepositories } from './utils/Repositories';
import { PlannerActions } from './roster/PlannerActions';
import { SidePanelActions } from './tracker/SidePanelActions';
import { EventActions } from './event/EventActions';
import { MomentTimeService } from './tracker/services/MomentTimeService';
import { MissionPlannerActions } from './crew/MissionPlannerActions';

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.fontWeight = Theme.fontWeight;
document.body.style.color = Theme.fontColor;
document.body.style.backgroundColor = Theme.dark;

const missionPlannerActions = new MissionPlannerActions(stores);

const AppWithRouter = withRouter((InjectedApp as any)) as typeof App;
const plannerActions = new PlannerActions(stores);
const sidePanelActions = new SidePanelActions(stores);
const eventActions = new EventActions(stores, new MomentTimeService());

ReactDOM.render(
  <Provider
    {...stores}
    plannerActions={plannerActions}
    sidePanelActions={sidePanelActions}
    eventActions={eventActions}
    missionPlannerActions={missionPlannerActions}
  >
    <ThemeProvider theme={Theme}>
      <BrowserRouter>
        <AppWithRouter repositories={WebRepositories}/>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);