import * as React from 'react';
import { Provider } from 'mobx-react';
import { DashboardPage } from '../DashboardPage';
import { mount } from 'enzyme';
import { ProfileSitePickerStore } from '../../../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../../../utils/Repositories';
import { readerAbility } from '../../abilities';
import { MemoryRouter } from 'react-router';
import { StyledDashboard } from '../../../dashboard/Dashboard';
import { TopBarActions } from '../../../widgets/TopBarActions';

describe('DashboardPage', () => {
  it('should not render if profile is a reader', async () => {
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    const topBarActions = new TopBarActions(
      {profileStore: profileStore},
      DoubleRepositories
    );
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

    const subject = mount(
      <MemoryRouter>
        <Provider
          profileStore={profileStore}
          topBarActions={topBarActions}
        >
          <DashboardPage/>
        </Provider>
      </MemoryRouter>
    );

    expect(subject.find('h1').text()).toContain('You do not have access to this page.');
    expect(subject.find(StyledDashboard).exists()).toBeFalsy();
  });
});