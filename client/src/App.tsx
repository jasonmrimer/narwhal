import * as React from 'react';

import Greeting from './greeting/Greeting';
import webService from './utils/WebService';

class App extends React.Component {
  render() {
    return (
      <div>
        <Greeting webService={webService} />
      </div>
    );
  }
}

export default App;
