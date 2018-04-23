import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';
import { NavLink } from 'react-router-dom';
import { ProfileModel } from '../profile/models/ProfileModel';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';

describe('TopBar', () => {
  let subject: ShallowWrapper;
  let profile: ProfileModel;
  beforeEach(() => {

    profile = {id: 1, username: 'Tytus', siteId: 14, siteName: '14', roleName: 'ADMIN', roleId: 1, classified: false};
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    profileStore.hydrate([], profile);
    subject = shallow(<TopBar profileStore={profileStore}/>);
  });

  it('renders the username with role', () => {
    expect(subject.text()).toContain('Tytus');
    expect(subject.text()).toContain('(ADMIN)');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('Narwhal');
  });

  it('renders all tabs', () => {
    expect(subject.find(NavLink).length).toBe(3);
  });

  it('should render a link to the Dashboard page', () => {
    expect(subject.find(NavLink).at(0).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(0).prop('to')).toBe('/dashboard');
  });

  it('should render a link to the Flights page', () => {
    expect(subject.find(NavLink).at(2).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(2).prop('to')).toBe('/flights');
  });

  it('should render a link to the Availability page', () => {
    expect(subject.find(NavLink).at(1).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(1).prop('to')).toBe('/');
  });
});