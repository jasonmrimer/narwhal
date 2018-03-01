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
import { CrewStore } from './crew/stores/CrewStore';
import { WebSkillRepository } from './skills/repositories/web/WebSkillRepository';
import { WebCrewRepository } from './crew/repositories/web/WebCrewRepository';
import { ProfileSitePickerStore } from './profile/stores/ProfileSitePickerStore';
import { withRouter } from 'react-router';

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.fontWeight = Theme.fontWeight;
document.body.style.color = Theme.fontColor;
document.body.style.backgroundColor = Theme.dark;

const webSiteRepository = new WebSiteRepository();
const dashboardStore = new DashboardStore(
  webSiteRepository,
  new WebMissionRepository()
);

const trackerStore = new TrackerStore(
  new WebAirmanRepository(),
  webSiteRepository,
  new WebSkillRepository(),
  new WebEventRepository(),
  new MomentTimeService(),
  new WebMissionRepository()
);

const crewStore = new CrewStore(
  new WebCrewRepository()
);
const profileStore = new ProfileSitePickerStore(new WebProfileRepository(), webSiteRepository);

/*tslint:disable:no-any*/
const AppWithRouter = withRouter((App as any)) as typeof App;

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <AppWithRouter
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
        crewStore={crewStore}
        profileStore={profileStore}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
