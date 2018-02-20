import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { App } from './App';
import { ProfileRepositoryStub } from '../profile/repositories/doubles/ProfileRepositoryStub';
import { MemoryRouter, Route } from 'react-router-dom';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { Tracker } from '../tracker/Tracker';
import { Dashboard } from '../dashboard/Dashboard';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { CrewStore } from '../crew/stores/CrewStore';
import { CrewRepositoryStub } from '../crew/repositories/doubles/CrewRepositoryStub';
import { CrewModelFactory } from '../crew/factories/CrewModelFactory';

const profileRepository = new ProfileRepositoryStub();
const siteRepository = new SiteRepositoryStub();
const dashboardStore = new DashboardStore(new MissionRepositoryStub(), siteRepository);
const crewStore = new CrewStore(new CrewRepositoryStub(CrewModelFactory.build()));

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
        crewStore={crewStore}
      />
    );

    const profile = await profileRepository.findOne();
    subject.setState({profile});

    const routes = subject.find(Route);
    expect(routes.length).toBe(4);
    expect(routes.at(0).prop('path')).toBe('/upload');
    expect(routes.at(1).prop('path')).toBe('/dashboard');
    expect(routes.at(2).prop('path')).toBe('/crew/:id');
    expect(routes.at(3).prop('path')).toBe('/');
  });

  it('renders the Tracker component when the route is /', async () => {
    const trackerStore = await makeFakeTrackerStore();
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/']}>
        <App
          trackerStore={trackerStore}
          profileRepository={profileRepository}
          dashboardStore={dashboardStore}
          crewStore={crewStore}
        />
      </MemoryRouter>
    );

    const profile = await profileRepository.findOne();
    mountedSubject.setState({profile});

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
          crewStore={crewStore}
        />
      </MemoryRouter>
    );

    const profile = await profileRepository.findOne();
    mountedSubject.setState({profile});

    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });
});