import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ProfileSitePicker } from './ProfileSitePicker';
import { forIt } from '../utils/testUtils';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../Repositories';
import { StyledSelectProfilePopup } from './SelectProfilePopup';

describe('ProfileSitePicker', () => {
  let subject: ShallowWrapper;
  let profileStore = new ProfileSitePickerStore(DoubleRepositories);

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

  it('renders the Sites full name on the button', () => {
    profileStore.dgsCoreSites.forEach((site, index) => {
      expect(subject.find('button').at(index).text()).toBe(site.fullName);
    });

    profileStore.dmsSites.forEach((site, index) => {
      expect(subject.find('button').at(index + 1).text()).toBe(site.fullName);
    });

    profileStore.guardSites.forEach((site, index) => {
      expect(subject.find('button').at(index + 2).text()).toBe(site.fullName);
    });
  });

  it('should render the selected profile popup after the site has been clicked', () => {
    subject.find('button').at(0).simulate('click');
    expect(subject.find(StyledSelectProfilePopup).exists()).toBeTruthy();
  });
});