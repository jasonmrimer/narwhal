import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import App from './widgets/App';
import { ThemeProvider } from 'styled-components';
import theme from './themes/default';
import WebProfileRepository from './profile/repositories/web/WebProfileRepository';
import WebSquadronRepository from './squadron/repositories/web/WebSquadronRepository';
import { BrowserRouter } from 'react-router-dom';
import WebAirmanRepository from './airman/repositories/web/WebAirmanRepository';
import WebCertificationRepository from './airman/repositories/web/WebCertificationRepository';
import WebEventRepository from './event/repositories/web/WebEventRepository';
import { AirmanStore } from './airman/AirmanStore';
import { CertificationStore } from './airman/CertificationStore';
import { SquadronStore } from './squadron/SquadronStore';
import { FlightStore } from './flight/FlightStore';
import { SiteStore } from './site/SiteStore';
import WebSiteRepository from './site/repositories/web/WebSiteRepository';
import WebMissionRepository from './mission/repositories/web/WebMissionRepository';
import { MissionStore } from './mission/MissionStore';

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.backgroundColor = theme.dark;

const squadronStore = new SquadronStore(new WebSquadronRepository());
const flightStore = new FlightStore(squadronStore);
const certificationStore = new CertificationStore(new WebCertificationRepository());
const airmanStore = new AirmanStore(
  new WebAirmanRepository(),
  squadronStore,
  flightStore,
  certificationStore,
  new WebEventRepository()
);
const siteStore = new SiteStore(new WebSiteRepository());
const missionStore = new MissionStore(new WebMissionRepository(), siteStore);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App
        certificationStore={certificationStore}
        airmanStore={airmanStore}
        squadronStore={squadronStore}
        profileRepository={new WebProfileRepository()}
        flightStore={flightStore}
        missionStore={missionStore}
        siteStore={siteStore}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
