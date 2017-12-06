import { shallow } from 'enzyme';
import * as React from 'react';

import App from './App';
import Roster from './roster/Roster';

it('renders a roster', () => {
  const wrapper = shallow(<App/>);
  expect(wrapper.find(Roster).exists()).toBeTruthy();
});
