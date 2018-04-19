import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import { App } from './widgets/App';
import { BrowserRouter } from 'react-router-dom';
import { Theme } from './themes/default';
import { ThemeProvider } from 'styled-components';
import { MomentTimeService } from './tracker/services/MomentTimeService';
import { TrackerStore } from './tracker/stores/TrackerStore';
import { DashboardStore } from './dashboard/stores/DashboardStore';
import { ProfileSitePickerStore } from './profile/stores/ProfileSitePickerStore';
import { withRouter } from 'react-router';
import { WebRepositories } from './utils/Repositories';
import { MissionPlannerStore } from './crew/stores/MissionPlannerStore';
import { AdminStore } from './admin/stores/AdminStore';

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.fontWeight = Theme.fontWeight;
document.body.style.color = Theme.fontColor;
document.body.style.backgroundColor = Theme.dark;

const dashboardStore = new DashboardStore(WebRepositories);
const trackerStore = new TrackerStore(WebRepositories, new MomentTimeService());
const profileStore = new ProfileSitePickerStore(WebRepositories);
const missionPlannerStore = new MissionPlannerStore(WebRepositories, profileStore);
const adminStore = new AdminStore(WebRepositories.profileRepository);
const AppWithRouter = withRouter((App as any)) as typeof App;

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <BrowserRouter>
      <AppWithRouter
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
        missionPlannerStore={missionPlannerStore}
        profileStore={profileStore}
        adminStore={adminStore}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
