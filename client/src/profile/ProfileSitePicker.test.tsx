import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { ProfileSitePicker } from './ProfileSitePicker';
import { ProfileRepositoryStub } from './repositories/doubles/ProfileRepositoryStub';
import { forIt } from '../utils/testUtils';
import { SiteModel } from '../site/models/SiteModel';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';

describe('ProfileSitePicker', () => {
  const siteRepository = new SiteRepositoryStub;
  const profileRepository = new ProfileRepositoryStub;
  let sites: SiteModel[];
  let subject: ShallowWrapper;
  let profileStore = new ProfileSitePickerStore(profileRepository, siteRepository);
  profileStore.setProfile = jest.fn();
  profileStore.save = jest.fn();

  beforeEach(async () => {
    await profileStore.hydrate();
    subject = shallow(
      <ProfileSitePicker
        profileStore={profileStore}
      />
    );
    await forIt();
    subject.update();
  });

  it('renders a welcome message', () => {
    expect(subject.text()).toContain('SELECT YOUR HOME SITE');
  });

  it('renders buttons to select sites by value', () => {
    const site = profileStore.siteByName('DMS-GA')!;
    expect(subject.find('button').length).toBe(2);
    expect(subject.find('button').at(0).prop('value')).toBe(site.id);
  });

  it('should set state with sites', () => {
    expect(subject.state('sites')).toEqual(sites);
  });

  it('should call a callback on handleChange', () => {
    subject.find('button').at(0).simulate('click', {target: {value: 1}});
    const updatedProfile = Object.assign(profileStore.profile, {siteId: 1});
    expect(profileStore.setProfile).toHaveBeenCalledWith(updatedProfile);
    expect(profileStore.save).toHaveBeenCalled();
  });
});