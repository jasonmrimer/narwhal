import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ErrorResponse } from '../utils/HTTPClient';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { AdminStore } from './stores/AdminStore';
import { ProfileList } from './ProfileList';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

describe('ProfileList', () => {
  let subject: ShallowWrapper;
  let store: AdminStore;
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    store = new AdminStore(DoubleRepositories);
    profileStore = new ProfileSitePickerStore(DoubleRepositories);

    const profiles = [
      {id: 1, roleName: '', roleId: 1, classified: false, siteId: 1, siteName: '1', username: 'User1'},
      {id: 2, roleName: '', roleId: 1, classified: false, siteId: 1, siteName: '1', username: 'User2'}
    ];
    store.hydrate(profiles, [{value: 1, name: 'role1'}, {value: 1, name: 'role1'}]);
    await profileStore.hydrate([], profiles[0]);
    store.setProfileRole = jest.fn();

    subject = shallow(<ProfileList adminStore={store} profileStore={profileStore}/>);
  });

  it('should display a list of users', () => {
    expect(subject.find('.profile-row').length).toBe(store.profiles.length);
    expect(subject.find('.profile-row').at(0).text()).toContain('User1');
    expect(subject.find('.profile-row').at(1).text()).toContain('User2');
  });

  it('should render a list of role options', () => {
    const controls = subject.find(StyledSingleTypeahead);
    expect(controls.length).toBe(store.profiles.length);
    expect(controls.at(0).prop('options')).toEqual(store.roleOptions);
    expect(controls.at(0).html()).toContain(store.profiles[0].roleId);
    controls.at(0).simulate('change', {value: store.roleOptions[1].value});
    expect(store.setProfileRole).toHaveBeenCalled();
  });

  it('should disable the role drop down for the current user', () => {
    expect(subject.find(StyledSingleTypeahead).at(0).prop('disabled')).toBeTruthy();
    expect(subject.find(StyledSingleTypeahead).at(1).prop('disabled')).toBeFalsy();
  });

  it('should display an error', () => {
    const errorResponse = new ErrorResponse('A Message');
    store.hydrate(errorResponse, [{value: 1, name: 'role1'}, {value: 1, name: 'role1'}]);

    subject = shallow(<ProfileList adminStore={store} profileStore={profileStore}/>);

    subject.update();

    expect(subject.find('.error').at(0).text()).toContain(errorResponse.message);
  });
});