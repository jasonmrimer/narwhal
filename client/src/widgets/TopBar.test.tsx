import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  let subject: ReactWrapper;

  beforeEach(() => {
    subject = mount(<TopBar username="Tytus" pageTitle="AVAILABILITY ROSTER"/>);
  });

  it('renders the username', () => {
    expect(subject.text()).toContain('Tytus');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('AVAILABILITY ROSTER');
  });
});