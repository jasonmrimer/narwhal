import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import App from './App';
import ProfileRepositoryStub from '../profile/repositories/doubles/ProfileRepositoryStub';
import { MemoryRouter, Route } from 'react-router-dom';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import { Tracker } from '../tracker/Tracker';
import Dashboard from '../dashboard/Dashboard';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';
import { makeFakeTrackerStore } from '../utils/testUtils';
import DashboardStore from '../dashboard/stores/DashboardStore';

const profileRepository = new ProfileRepositoryStub();
const siteRepository = new SiteRepositoryStub();
const dashboardStore = new DashboardStore(new MissionRepositoryStub(), siteRepository);

let subject: ShallowWrapper;
let mountedSubject: ReactWrapper;

describe('App', () => {
  it('renders a route for the dashboard and roster', async () => {
    const trackerStore = await makeFakeTrackerStore();
    subject = shallow(
      <App
        trackerStore={trackerStore}
        profileRepository={profileRepository}
        dashboardStore={dashboardStore}
      />
    );
    const routes = subject.find(Route);

    expect(routes.length).toBe(3);
    expect(routes.at(0).prop('path')).toBe('/upload');
    expect(routes.at(1).prop('path')).toBe('/dashboard');
    expect(routes.at(2).prop('path')).toBe('/');
  });

  it('renders the Tracker component when the route is /', async () => {
    const trackerStore = await makeFakeTrackerStore();
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/']}>
        <App
          trackerStore={trackerStore}
          profileRepository={profileRepository}
          dashboardStore={dashboardStore}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
  });

  it('renders the Dashboard component when the route is /dashboard', async () => {
    const trackerStore = await makeFakeTrackerStore();
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App
          trackerStore={trackerStore}
          profileRepository={profileRepository}
          dashboardStore={dashboardStore}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });
});
