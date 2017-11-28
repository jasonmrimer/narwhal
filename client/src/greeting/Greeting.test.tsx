import { shallow } from 'enzyme';
import * as React from 'react';

import { WebService } from '../utils/WebService';
import Greeting from './Greeting';

describe('Greeting', () => {
  const webServiceMock: WebService = { get: jest.fn(() => new Promise(resolve => resolve({ phrase: '' }))) };
  const wrapper = shallow(<Greeting webService={webServiceMock} />);

  it('calls an webService on componentDidMount', () => {
    expect(webServiceMock.get).toBeCalledWith('/greeting');
  });

  it('renders the phrase as text', () => {
    wrapper.setState({ phrase: 'Hello!' });
    expect(wrapper.text()).toBe('Hello!');
  });
});