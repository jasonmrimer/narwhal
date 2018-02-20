import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import { App } from './widgets/App';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from './themes/default';
import { ThemeProvider } from 'styled-components';
import { WebProfileRepository } from './profile/repositories/web/WebProfileRepository';
import { WebAirmanRepository } from './airman/repositories/web/WebAirmanRepository';
import { WebSiteRepository } from './site/repositories/web/WebSiteRepository';
import { WebMissionRepository } from './mission/repositories/web/WebMissionRepository';
import { WebEventRepository } from './event/repositories/web/WebEventRepository';
import { MomentTimeService } from './tracker/services/MomentTimeService';
import { TrackerStore } from './tracker/stores/TrackerStore';
import { DashboardStore } from './dashboard/stores/DashboardStore';
import { AvailabilityStore } from './availability/stores/AvailabilityStore';
import { CurrencyStore } from './currency/stores/CurrencyStore';
import { PlannerStore } from './roster/stores/PlannerStore';
import { MissionStore } from './mission/stores/MissionStore';
import { CrewStore } from './crew/stores/CrewStore';
import { WebSkillRepository } from './skills/repositories/web/WebSkillRepository';
import { WebCrewRepository } from './crew/repositories/web/WebCrewRepository';

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.color = Theme.fontColor;
document.body.style.backgroundColor = Theme.dark;

const siteRepository = new WebSiteRepository();

const dashboardStore = new DashboardStore(
  new WebMissionRepository(),
  siteRepository
);

const trackerStore = new TrackerStore(
  new WebAirmanRepository(),
  siteRepository,
  new WebSkillRepository(),
  new WebEventRepository(),
  new CurrencyStore(),
  new AvailabilityStore(),
  new PlannerStore(new MomentTimeService()),
  new MissionStore(new WebMissionRepository())
);

const crewStore = new CrewStore(new WebCrewRepository());

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <App
        profileRepository={new WebProfileRepository()}
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
        crewStore={crewStore}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
