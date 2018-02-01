import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import App from './widgets/App';
import { ThemeProvider } from 'styled-components';
import theme from './themes/default';
import WebProfileRepository from './profile/repositories/web/WebProfileRepository';
import { BrowserRouter } from 'react-router-dom';
import WebAirmanRepository from './airman/repositories/web/WebAirmanRepository';
import WebCertificationRepository from './airman/repositories/web/WebCertificationRepository';
import WebSiteRepository from './site/repositories/web/WebSiteRepository';
import WebMissionRepository from './mission/repositories/web/WebMissionRepository';
import TrackerStore from './tracker/stores/TrackerStore';
import DashboardStore from './dashboard/stores/DashboardStore';
import { MomentTimeService } from './tracker/services/MomentTimeService';
import WebEventRepository from './event/repositories/web/WebEventRepository';
import WebQualificationRepository from './qualifications/repositories/web/WebQualificationRepository';

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.backgroundColor = theme.dark;

const siteRepository = new WebSiteRepository();

const dashboardStore = new DashboardStore(
  new WebMissionRepository(),
  siteRepository
);

const trackerStore = new TrackerStore(
  new WebAirmanRepository(),
  siteRepository,
  new WebCertificationRepository(),
  new WebQualificationRepository(),
  new WebEventRepository(),
  new MomentTimeService()
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App
        profileRepository={new WebProfileRepository()}
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
