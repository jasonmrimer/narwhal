import { shallow } from 'enzyme';
import * as React from 'react';

import App from './App';
import Greeting from './greeting/Greeting';

it('renders a greeting', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(Greeting).exists()).toBeTruthy();
});
