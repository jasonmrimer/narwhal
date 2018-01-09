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
import WebMissionRepository from './mission/repositories/web/WebMissionRepository';
import WebSiteRepository from './site/repositories/web/WebSiteRepository';
import WebAirmanRepository from './airman/repositories/web/WebAirmanRepository';

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.backgroundColor = theme.dark;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App
        airmanRepository={new WebAirmanRepository()}
        squadronRepository={new WebSquadronRepository()}
        profileRepository={new WebProfileRepository()}
        missionRepository={new WebMissionRepository()}
        siteRepository={new WebSiteRepository()}
      />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
