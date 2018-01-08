import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import App from './App';
import ProfileRepositoryStub from '../profile/repositories/doubles/ProfileRepositoryStub';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import UnitRepositoryStub from '../unit/repositories/doubles/UnitRepositoryStub';
import { MemoryRouter, Route } from 'react-router-dom';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import { Tracker } from '../tracker/Tracker';
import Dashboard from '../dashboard/Dashboard';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';
import FlightRepositoryStub from '../flight/repositories/doubles/FlightRepositoryStub';

describe('App', () => {
  const airmanRepository = new AirmanRepositoryStub();
  const unitRepository = new UnitRepositoryStub();
  const profileRepository = new ProfileRepositoryStub();
  const missionRepositoryStub = new MissionRepositoryStub();
  const siteRepositoryStub = new SiteRepositoryStub();
  const flightRepositoryStub = new FlightRepositoryStub();
  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;

  it('renders a route for the dashboard and roster', () => {
    subject = shallow(
      <App
        airmanRepository={airmanRepository}
        unitRepository={unitRepository}
        profileRepository={profileRepository}
        missionRepository={missionRepositoryStub}
        siteRepository={siteRepositoryStub}
        flightRepository={flightRepositoryStub}
      />
    );
    const routes = subject.find(Route);

    expect(routes.length).toBe(2);
    expect(routes.at(0).prop('path')).toBe('/dashboard');
    expect(routes.at(1).prop('path')).toBe('/');
  });

  it('renders the Tracker component when the route is /', () => {
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/']}>
        <App
          airmanRepository={airmanRepository}
          unitRepository={unitRepository}
          profileRepository={profileRepository}
          missionRepository={missionRepositoryStub}
          siteRepository={siteRepositoryStub}
          flightRepository={flightRepositoryStub}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
  });

  it('renders the Dashboard component when the route is /dashboard', () => {
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App
          airmanRepository={airmanRepository}
          unitRepository={unitRepository}
          profileRepository={profileRepository}
          missionRepository={missionRepositoryStub}
          siteRepository={siteRepositoryStub}
          flightRepository={flightRepositoryStub}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });
});
