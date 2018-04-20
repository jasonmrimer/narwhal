import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';
import { NavLink } from 'react-router-dom';
import { ProfileModel } from '../profile/models/ProfileModel';

describe('TopBar', () => {
  let subject: ShallowWrapper;
  let profile: ProfileModel;
  beforeEach(() => {

    profile = {id: 1, username: 'Tytus', siteId: 14, siteName: '14', roleName: 'ADMIN', roleId: 1, classified: false};
    subject = shallow(<TopBar profile={profile}/>);
  });

  it('renders the username with role', () => {
    expect(subject.text()).toContain('Tytus');
    expect(subject.text()).toContain('(ADMIN)');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('Narwhal');
  });

  it('renders a Mission and Availability tab', () => {
    expect(subject.find(NavLink).length).toBe(2);
  });

  it('should render a link to the Dashboard page', () => {
    expect(subject.find(NavLink).at(0).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(0).prop('to')).toBe('/dashboard');
  });

  it('should render a link to the Availability page', () => {
    expect(subject.find(NavLink).at(1).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(1).prop('to')).toBe('/');
  });
});