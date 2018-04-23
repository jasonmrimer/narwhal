import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SelectProfilePopup } from './SelectProfilePopup';
import { SiteModel, SiteType } from '../site/models/SiteModel';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';

describe('SelectProfilePopup', () => {
  let subject: ShallowWrapper;
  let sites: SiteModel[];
  let profileStore = new ProfileSitePickerStore(DoubleRepositories);

  beforeEach(() => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    sites = [new SiteModel(1, '', [], SiteType.DGSCoreSite, '')];

    profileStore.hydrate(
      sites, {
        id: 1,
        username: 'user',
        siteId: 14,
        roleId: 1,
        roleName: 'admin',
        classified: true,
        siteName: 'site'
      }
    );

    profileStore.setPendingSite(sites[0]);
    profileStore.savePendingSite = jest.fn();

    subject = shallow(<SelectProfilePopup profileStore={profileStore}/>);
  });

  it('should renders with a title', () => {
    expect(subject.find('.title').text()).toBe('Site Selection');
  });

  it('should render a prompt', () => {
    expect(subject.find('.description').text())
      .toBe(`This will set ${sites[0].fullName.toUpperCase()} as your home site. This cannot currently be undone.`);
  });

  it('should render two buttons with text', () => {
    expect(subject.find('button').at(0).text()).toBe('BACK');
    expect(subject.find('button').at(1).text()).toBe('CONTINUE');
  });

  it('should set the pending site to null on back button click', () => {
    subject.find('button.back').simulate('click');
    expect(profileStore.pendingSite).toBeNull();
  });

  it('should save the profile on continue button click', async () => {
    subject.find('button.continue').simulate('click');
    expect(profileStore.savePendingSite).toHaveBeenCalled();
  });
});