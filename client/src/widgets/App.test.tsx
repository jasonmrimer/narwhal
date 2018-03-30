import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { App, ClassificationBanner } from './App';
import { MemoryRouter } from 'react-router-dom';
import { Tracker } from '../tracker/Tracker';
import { Dashboard } from '../dashboard/Dashboard';
import { forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { CrewStore } from '../crew/stores/CrewStore';
import { Crew } from '../crew/Crew';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { ThemeProvider } from 'styled-components';
import { DoubleRepositories } from '../Repositories';
import { UserModel } from '../profile/models/ProfileModel';
import { Theme } from '../themes/default';

describe('App', () => {
  let mountedSubject: ReactWrapper;

  describe('ProfileSitePicker', () => {
    let profileStore: ProfileSitePickerStore;

    beforeEach(async () => {
      const trackerStore = await makeFakeTrackerStore();
      const dashboardStore = new DashboardStore(DoubleRepositories);
      const crewStore = new CrewStore(DoubleRepositories, profileStore);
      const profileRepo = {
        findOne: () => {
          return Promise.resolve({
            user: {id: 1, username: 'FontFace', siteId: null},
            classified: false
          });
        },

        save: (user: UserModel) => {
          return Promise.resolve({user: user, classified: false});
        }
      };

      const repositories = Object.assign({}, DoubleRepositories, {profileRepository: profileRepo});
      profileStore = new ProfileSitePickerStore(repositories);
      await profileStore.hydrate();

      mountedSubject = mount(
        <ThemeProvider theme={Theme}>
          <MemoryRouter initialEntries={['/']}>
            <App
              trackerStore={trackerStore}
              profileStore={profileStore}
              dashboardStore={dashboardStore}
              crewStore={crewStore}
            />
          </MemoryRouter>
        </ThemeProvider>
      );
      await forIt();
      mountedSubject.update();
    });

    it('renders the correct classification banner', () => {
      const classifiedBanner = 'Dynamic Classification Highest Possible Classification: TS//SI//REL TO USA, FVEY';
      expect(mountedSubject.find(ClassificationBanner).text()).toBe('Not Actual Classification. Prototype Only');
      profileStore.profile!.classified = true;
      mountedSubject.update();
      expect(mountedSubject.find(ClassificationBanner).text()).toBe(classifiedBanner);
    });

    it('renders the ProfileSitePicker component when user profile has no site', () => {
      expect(mountedSubject.find(StyledProfileSitePicker).exists()).toBeTruthy();
    });

    it('should render the Tracker page after saving a profile', async () => {
      profileStore.setPendingSite(profileStore.dgsCoreSites[0])
      await profileStore.savePendingSite();
      mountedSubject.update();
      expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
    });
  });

  it('renders the Tracker component when the route is /', async () => {
    mountedSubject = await createMountedPage('/');
    expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
  });

  it('renders the Dashboard component when the route is /dashboard', async () => {
    mountedSubject = await createMountedPage('/dashboard');
    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });

  it('renders the Crew component when the route is /crew', async () => {
    mountedSubject = await createMountedPage('/crew/1');
    expect(mountedSubject.find(Crew).exists()).toBeTruthy();
  });
});

const createMountedPage = async (entry: string) => {
  const trackerStore = await makeFakeTrackerStore();
  const dashboardStore = new DashboardStore(DoubleRepositories);
  const profileStore = new ProfileSitePickerStore(DoubleRepositories);
  const crewStore = new CrewStore(DoubleRepositories, profileStore);

  const mountedRouter = mount(
    <ThemeProvider theme={Theme}>
      <MemoryRouter initialEntries={[entry]}>
        <App
          trackerStore={trackerStore}
          profileStore={profileStore}
          dashboardStore={dashboardStore}
          crewStore={crewStore}
        />
      </MemoryRouter>
    </ThemeProvider>
  );
  await forIt();
  mountedRouter.update();
  return mountedRouter;
};