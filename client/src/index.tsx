import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './polyfills';
import App from './widgets/App';
import { ThemeProvider } from 'styled-components';
import theme from './themes/default';
import WebProfileRepository from './profile/repositories/web/WebProfileRepository';
import WebUnitRepository from './unit/repositories/web/WebUnitRepository';
import { BrowserRouter } from 'react-router-dom';
import WebMissionRepository from './mission/repositories/web/WebMissionRepository';
import WebSiteRepository from './site/repositories/web/WebSiteRepository';
import WebAirmanRepository from './airman/repositories/web/WebAirmanRepository';
import WebCrewRepository from './crew/repositories/web/WebCrewRepository';

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.backgroundColor = theme.dark;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App
        airmanRepository={new WebAirmanRepository()}
        unitRepository={new WebUnitRepository()}
        profileRepository={new WebProfileRepository()}
        missionRepository={new WebMissionRepository()}
        siteRepository={new WebSiteRepository()}
        crewRepository={new WebCrewRepository()}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
