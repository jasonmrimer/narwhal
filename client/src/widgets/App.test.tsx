import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { App } from './App';
import { ProfileRepositoryStub } from '../profile/repositories/doubles/ProfileRepositoryStub';
import { MemoryRouter, Route } from 'react-router-dom';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { Tracker } from '../tracker/Tracker';
import { Dashboard } from '../dashboard/Dashboard';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { CrewStore } from '../crew/stores/CrewStore';
import { CrewRepositorySpy } from '../crew/repositories/doubles/CrewRepositorySpy';
import { CrewModelFactory } from '../crew/factories/CrewModelFactory';
import { Crew } from '../crew/Crew';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { ProfileModel } from '../profile/models/ProfileModel';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';

const siteRepository = new SiteRepositoryStub();
const dashboardStore = new DashboardStore(siteRepository, new MissionRepositoryStub());
const crewStore = new CrewStore(new CrewRepositorySpy(CrewModelFactory.build()));

let subject: ShallowWrapper;
let mountedSubject: ReactWrapper;

describe('App', () => {
  it('renders a route for the dashboard, roster and crew', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const profileStore = new ProfileSitePickerStore(new ProfileRepositoryStub(), siteRepository);
    subject = shallow(
      <App
        trackerStore={trackerStore}
        profileStore={profileStore}
        dashboardStore={dashboardStore}
        crewStore={crewStore}
      />
    );
    await forIt();
    subject.update();

    const routes = subject.find(Route);
    expect(routes.length).toBe(4);
    expect(routes.at(0).prop('path')).toBe('/upload');
    expect(routes.at(1).prop('path')).toBe('/dashboard');
    expect(routes.at(2).prop('path')).toBe('/crew/:id');
    expect(routes.at(3).prop('path')).toBe('/');
  });

  it('renders the Tracker component when the route is /', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const profileStore = new ProfileSitePickerStore(new ProfileRepositoryStub(), siteRepository);
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/']}>
        <App
          trackerStore={trackerStore}
          profileStore={profileStore}
          dashboardStore={dashboardStore}
          crewStore={crewStore}
        />
      </MemoryRouter>
    );
    await forIt();
    mountedSubject.update();
    expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
  });

  describe('ProfileSitePicker', () => {
    let profileStore: ProfileSitePickerStore;
    beforeEach(async () => {
      const trackerStore = await makeFakeTrackerStore();
      const profileRepo = {
        findOne: () => {
          return Promise.resolve({id: 1, username: 'FontFace', siteId: null});
        },

        save: (profile: ProfileModel) => {
          return Promise.resolve(profile);
        }
      };
      profileStore = new ProfileSitePickerStore(profileRepo, siteRepository);
      await profileStore.hydrate();
      mountedSubject = mount(
        <MemoryRouter initialEntries={['/']}>
          <App
            trackerStore={trackerStore}
            profileStore={profileStore}
            dashboardStore={dashboardStore}
            crewStore={crewStore}
          />
        </MemoryRouter>
      );
      await forIt();
      mountedSubject.update();
    });

    it('renders the ProfileSitePicker component when user profile has no site', () => {
      expect(mountedSubject.find(StyledProfileSitePicker).exists()).toBeTruthy();
    });

    it('should render the Tracker page after saving a profile', async () => {
      profileStore.setProfile({username: 'FontFace', siteId: 1, id: 1});
      mountedSubject.update();
      expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
    });
  });

  it('renders the Dashboard component when the route is /dashboard', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const profileStore = new ProfileSitePickerStore(new ProfileRepositoryStub(), siteRepository);
    await profileStore.hydrate();
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App
          trackerStore={trackerStore}
          profileStore={profileStore}
          dashboardStore={dashboardStore}
          crewStore={crewStore}
        />
      </MemoryRouter>
    );
    await forIt();

    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });

  it('renders the Crew component when the route is /crew', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const profileStore = new ProfileSitePickerStore(new ProfileRepositoryStub(), siteRepository);
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/crew/1']}>
        <App
          trackerStore={trackerStore}
          profileStore={profileStore}
          dashboardStore={dashboardStore}
          crewStore={crewStore}
        />
      </MemoryRouter>
    );
    await forIt();
    mountedSubject.update();

    expect(mountedSubject.find(Crew).exists()).toBeTruthy();
  });
});