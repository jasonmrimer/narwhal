import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ErrorResponse } from '../utils/HTTPClient';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { AdminStore } from './stores/AdminStore';
import { ProfileList } from './ProfileList';
import { DoubleRepositories } from '../utils/Repositories';

describe('ProfileList', () => {
  let subject: ShallowWrapper;
  let store: AdminStore;
  let profileStore: ProfileSitePickerStore;

  beforeEach(() => {
    store = new AdminStore(DoubleRepositories);
    profileStore = new ProfileSitePickerStore(DoubleRepositories);

    const profiles = [
      {id: 1, roleName: '', roleId: 1, classified: false, siteId: 1, siteName: '1', username: 'User1'},
      {id: 2, roleName: '', roleId: 1, classified: false, siteId: 1, siteName: '1', username: 'User2'}
    ];
    store.hydrate(profiles, [{value: 1, name: 'role1'}, {value: 1, name: 'role1'}]);
    profileStore.hydrate([], profiles[0]);
    store.setProfileRole = jest.fn();

    subject = shallow(<ProfileList adminStore={store} profileStore={profileStore}/>);
  });

  it('should display a list of users', () => {
    expect(subject.find('.profile-row').length).toBe(store.profiles.length);
    expect(subject.find('.profile-row').at(0).text()).toContain('User1');
    expect(subject.find('.profile-row').at(1).text()).toContain('User2');
  });

  it('should render a list of role options', () => {
    const dropdowns = subject.find(StyledDropdown);
    expect(dropdowns.length).toBe(store.profiles.length);
    expect(dropdowns.at(0).prop('options')).toEqual(store.roleOptions);
    expect(dropdowns.at(0).prop('value')).toEqual(store.profiles[0].roleId);
    dropdowns.at(0).simulate('change', {
      target: {
        value: store.roleOptions[1].value
      }
    });
    expect(store.setProfileRole).toHaveBeenCalledWith(store.profiles[0], store.roleOptions[1].value);
  });

  it('should disable the role drop down for the current user', () => {
    expect(subject.find(StyledDropdown).at(0).prop('disabled')).toBeTruthy();
    expect(subject.find(StyledDropdown).at(1).prop('disabled')).toBeFalsy();
  });

  it('should display an error', () => {
    const errorResponse = new ErrorResponse('A Message');
    store.hydrate(errorResponse, [{value: 1, name: 'role1'}, {value: 1, name: 'role1'}]);

    subject = shallow(<ProfileList adminStore={store} profileStore={profileStore}/>);

    subject.update();

    expect(subject.find('.error').at(0).text()).toContain(errorResponse.message);
  });
});