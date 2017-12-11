import { shallow } from 'enzyme';
import * as React from 'react';

import App from './App';
import Tracker from './tracker/Tracker';

it('renders a tracker', () => {
  const wrapper = shallow(<App/>);
  expect(wrapper.find(Tracker).exists()).toBeTruthy();
});
