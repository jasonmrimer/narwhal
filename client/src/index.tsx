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

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.fontWeight = Theme.fontWeight;
document.body.style.color = Theme.fontColor;
document.body.style.backgroundColor = Theme.dark;

const AppWithRouter = withRouter((InjectedApp as any)) as typeof App;

ReactDOM.render(
  <Provider {...stores}>
    <ThemeProvider theme={Theme}>
      <BrowserRouter>
        <AppWithRouter repositories={WebRepositories}/>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);