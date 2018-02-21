import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  let subject: ShallowWrapper;

  beforeEach(() => {
    subject = shallow(<TopBar username="Tytus" pageTitle="AVAILABILITY ROSTER"/>);
  });

  it('renders the username', () => {
    expect(subject.text()).toContain('Tytus');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('AVAILABILITY ROSTER');
  });
});