import * as React from 'react';
import { mount } from 'enzyme';
import * as Cookie from 'js-cookie';
import Upload from './Upload';

describe('Upload', () => {
  it('renders two forms', () => {
    const subject = mount(<Upload/>);
    expect(subject.find('form').length).toBe(3);
  });

  it('renders with a hidden csrf token', () => {
    const testToken = 'token';
    Cookie.set('XSRF-TOKEN', testToken);
    const subject = mount(<Upload/>);
    Cookie.remove('XSRF-TOKEN');
    const hiddenInput = subject.find('input[type="hidden"]').at(0);
    expect(hiddenInput.prop('value')).toBe(testToken);
  });
});