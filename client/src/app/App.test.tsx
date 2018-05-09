import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { App, StyledClassificationBanner, WrappedRoutes } from './App';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../utils/Repositories';

describe('App', () => {
  let profileStore: ProfileSitePickerStore;
  let subject: ShallowWrapper;

  describe('ProfileSitePicker', () => {
    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    profileStore.hydrate([], {
      id: 1,
      roleId: 1,
      username: 'user',
      siteId: null,
      siteName: 'DGS',
      roleName: 'role',
      classified: false
    });

    const appActions: any = {
      getSiteAndProfile: jest.fn()
    };

    subject = shallow(
      <App
        profileStore={profileStore}
        appActions={appActions}
      />
    );

    it('renders the correct classification banner', () => {
      expect(subject.find(StyledClassificationBanner).prop('classified')).toBeFalsy();
    });

    it('renders the ProfileSitePicker component when user profile has no site', () => {
      expect(subject.find(StyledProfileSitePicker).exists()).toBeTruthy();
    });

    it('should render the Tracker page after saving a profile', async () => {
      profileStore.hydrate([], {
        id: 1,
        roleId: 1,
        username: 'user',
        siteId: 1,
        siteName: 'DGS',
        roleName: 'role',
        classified: false
      });
      subject.instance().forceUpdate();
      subject.update();
      expect(subject.find(WrappedRoutes).exists()).toBeTruthy();
    });
  });
});
