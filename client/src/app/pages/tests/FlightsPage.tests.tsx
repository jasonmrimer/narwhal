import * as React from 'react';
import { Provider } from 'mobx-react';
import { mount } from 'enzyme';
import { ProfileSitePickerStore } from '../../../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../../../utils/Repositories';
import { readerAbility } from '../../abilities';
import { MemoryRouter } from 'react-router';
import { StyledDashboard } from '../../../dashboard/Dashboard';
import { FlightsPage } from '../FlightsPage';

describe('FlightsPage', () => {
  it('should not render if profile is a reader', () => {
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
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
    profileStore.hydrate([], profile);

    const subject = mount(
      <MemoryRouter>
        <Provider profileStore={profileStore}>
          <FlightsPage/>
        </Provider>
      </MemoryRouter>
    );

    expect(subject.find('h1').text()).toContain('You do not have access to this page.');
    expect(subject.find(StyledDashboard).exists()).toBeFalsy();
  });
});