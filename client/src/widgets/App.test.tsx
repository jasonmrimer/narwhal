import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import App from './App';
import ProfileRepositoryStub from '../profile/repositories/doubles/ProfileRepositoryStub';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import SquadronRepositoryStub from '../squadron/repositories/doubles/SquadronRepositoryStub';
import { MemoryRouter, Route } from 'react-router-dom';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import { Tracker } from '../tracker/Tracker';
import Dashboard from '../dashboard/Dashboard';
import CertificationRepositoryStub from '../airman/repositories/doubles/CertificationRepositoryStub';
import EventRepositoryStub from '../event/repositories/doubles/EventRepositoryStub';
import { AirmanStore } from '../airman/AirmanStore';
import { FlightStore } from '../flight/FlightStore';
import { CertificationStore } from '../airman/CertificationStore';
import { SquadronStore } from '../squadron/SquadronStore';
import { MissionStore } from '../mission/MissionStore';
import { SiteStore } from '../site/SiteStore';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';

describe('App', () => {
  const certificationStore: CertificationStore = new CertificationStore(new CertificationRepositoryStub());
  const squadronStore: SquadronStore = new SquadronStore(new SquadronRepositoryStub());
  const profileRepository = new ProfileRepositoryStub();
  const eventRepositoryStub = new EventRepositoryStub();
  const flightStore: FlightStore = new FlightStore(squadronStore);
  const siteStore = new SiteStore(new SiteRepositoryStub());
  const missionStore = new MissionStore(new MissionRepositoryStub(), siteStore);
  const airmanStore: AirmanStore = new AirmanStore(
    new AirmanRepositoryStub(),
    squadronStore,
    flightStore,
    certificationStore
  );

  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;

  it('renders a route for the dashboard and roster', () => {
    subject = shallow(
      <App
        airmanStore={airmanStore}
        certificationStore={certificationStore}
        squadronStore={squadronStore}
        profileRepository={profileRepository}
        eventRepository={eventRepositoryStub}
        flightStore={flightStore}
        missionStore={missionStore}
        siteStore={siteStore}
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
          airmanStore={airmanStore}
          certificationStore={certificationStore}
          squadronStore={squadronStore}
          profileRepository={profileRepository}
          eventRepository={eventRepositoryStub}
          flightStore={flightStore}
          missionStore={missionStore}
          siteStore={siteStore}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Tracker).exists()).toBeTruthy();
  });

  it('renders the Dashboard component when the route is /dashboard', () => {
    mountedSubject = mount(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App
          airmanStore={airmanStore}
          certificationStore={certificationStore}
          squadronStore={squadronStore}
          profileRepository={profileRepository}
          eventRepository={eventRepositoryStub}
          flightStore={flightStore}
          missionStore={missionStore}
          siteStore={siteStore}
        />
      </MemoryRouter>
    );

    expect(mountedSubject.find(Dashboard).exists()).toBeTruthy();
  });
});
