import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ProfileSitePicker } from './ProfileSitePicker';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { SiteModel, SiteType } from '../site/models/SiteModel';

import { SquadronModel } from '../squadron/models/SquadronModel';
import { StyledSelectProfilePopup } from './SelectProfilePopup';
import { StyledSquadronButton } from './SquadronButton';

describe('ProfileSitePicker', () => {
  let subject: ShallowWrapper;
  let sites: SiteModel[];
  const dgsFullName = 'DGS CORE SITE';
  const dmsFullName = 'DMS CORE SITE';

  let profileStore = new ProfileSitePickerStore(DoubleRepositories);
  beforeEach(async () => {
    const squadron = new SquadronModel(1, 'Squad 1', []);
    sites = [
      new SiteModel(1, 'DGS', [squadron], SiteType.DGSCoreSite, dgsFullName),
      new SiteModel(2, 'DMS', [], SiteType.DMSSite, dmsFullName),
    ];
    await profileStore.hydrate(
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
  });

  it('renders a welcome message', () => {
    expect(subject.text()).toContain('SELECT YOUR HOME SITE');
  });

  it('renders the Sites full name on the button', () => {
    expect(subject.find('button').at(0).text()).toBe(dgsFullName);
    expect(subject.find('button').at(1).text()).toBe(dmsFullName);
  });

  describe('selecting a site', () => {
    it('should show a list of squadrons when selecting a site with squadrons', () => {
      expect(subject.find(StyledSquadronButton).exists()).toBeFalsy();
      subject.find('button').at(0).simulate('click');
      expect(subject.find(StyledSquadronButton).exists()).toBeTruthy();
      expect(subject.find(StyledSquadronButton).length).toBe(1);
    });

    it('should show the pop after selecting a site with no squadrons', () => {
      subject.find('button').at(0).simulate('click');
      expect(subject.find(StyledSelectProfilePopup).exists()).toBeFalsy();

      subject.find('button').at(1).simulate('click');
      expect(subject.find(StyledSelectProfilePopup).exists()).toBeTruthy();
    });
  });
});
