import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SelectProfilePopup } from './SelectProfilePopup';
import { SiteModel } from '../site/models/SiteModel';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { forIt } from '../utils/testUtils';

describe('SelectProfilePopup', () => {
  let subject: ShallowWrapper;
  let site: SiteModel;
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();
    site = profileStore.guardSites[0];

    subject = shallow(
      <SelectProfilePopup
        selectedSite={site}
        backFromPendingSiteSelection={profileStore.cancelPendingSite}
        continuePendingSiteSelection={profileStore.savePendingSite}
      />
    );
  });

  it('should renders with a title', () => {
    expect(subject.find('.title').text()).toBe('Site Selection');
  });

  it('should render a prompt', () => {
    expect(subject.find('.description').text())
      .toBe(`This will set ${site.fullName.toUpperCase()} as your home site. This cannot currently be undone.`);
  });

  it('should render two buttons with text', () => {
    expect(subject.find('button').at(0).text()).toBe('BACK');
    expect(subject.find('button').at(1).text()).toBe('CONTINUE');
  });

  it('should set the pending site to null on back button click', () => {
    profileStore.setPendingSite(site);
    subject.find('button.back').simulate('click');
    expect(profileStore.pendingSite).toBeNull();
  });

  it('should save the profile on continue button click', async () => {
    profileStore.setPendingSite(site);
    subject.find('button.continue').simulate('click');
    await forIt();
    expect(profileStore.profile!.siteId).toBe(site.id);
  });

});