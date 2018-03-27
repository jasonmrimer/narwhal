import * as React from 'react';
import { mount } from 'enzyme';
import { Upload } from './Upload';

describe('Upload', () => {
  it('renders upload forms', () => {
    const subject = mount(<Upload/>);
    expect(subject.find('form').length).toBe(5);
  });
});