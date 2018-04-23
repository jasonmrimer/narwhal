import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ProfileSitePicker } from './ProfileSitePicker';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { SiteModel, SiteType } from '../site/models/SiteModel';

describe('ProfileSitePicker', () => {
  let subject: ShallowWrapper;
  let sites: SiteModel[];
  let profileStore = new ProfileSitePickerStore(DoubleRepositories);
  profileStore.setPendingSite = jest.fn();

  beforeEach(() => {
    sites = [new SiteModel(1, '', [], SiteType.DGSCoreSite, '')];
    profileStore.hydrate(
      sites,
      {
        id: 1,
        username: 'user',
        siteId: 14,
        roleId: 1,
        roleName: 'admin',
        classified: true,
        siteName: 'site'
      }
    );
    subject = shallow(
      <ProfileSitePicker
        profileStore={profileStore}
      />
    );
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
    expect(profileStore.setPendingSite).toHaveBeenCalledWith(sites[0]);
  });
});