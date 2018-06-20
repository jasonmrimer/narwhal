import * as React from 'react';
import { Provider } from 'mobx-react';
import { mount, ReactWrapper } from 'enzyme';
import { ProfileSitePickerStore } from '../../../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../../../utils/Repositories';
import { readerAbility } from '../../abilities';
import { MemoryRouter } from 'react-router';
import { StyledDashboard } from '../../../dashboard/Dashboard';
import { FlightsPage } from '../FlightsPage';
import { SiteManagerStore } from '../../../site-manager/stores/SiteManagerStore';
import { TopBarActions } from '../../../widgets/TopBarActions';

describe('FlightsPage', () => {
  const siteManagerStore = new SiteManagerStore(DoubleRepositories);
  const profileStore = new ProfileSitePickerStore(DoubleRepositories);
  const topBarActions = new TopBarActions({profileStore: profileStore});
  let subject: ReactWrapper;
  beforeEach(async () => {
    const profile = {
      id: 1,
      username: 'Tytus',
      siteId: 14,
      siteName: '14',
      roleName: 'READER',
      roleId: 1,
      classified: false,
      ability: readerAbility
    };
    await profileStore.hydrate([], profile);

    subject = mount(
      <MemoryRouter>
        <Provider
          profileStore={profileStore}
          siteManagerStore={siteManagerStore}
          topBarActions={topBarActions}
        >
          <FlightsPage repositories={DoubleRepositories}/>
        </Provider>
      </MemoryRouter>
    );
  });
  it('should not render if profile is a reader', () => {
    expect(subject.find('h1').text()).toContain('You do not have access to this page.');
    expect(subject.find(StyledDashboard).exists()).toBeFalsy();
  });
});