import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import Mission from '../mission/Mission';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import TopBar from '../widgets/TopBar';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';
import { MissionModel } from '../mission/models/MissionModel';

const missionRepositoryStub = new MissionRepositoryStub();

describe('Dashboard', () => {
  let missions: MissionModel[];
  let subject: ReactWrapper;

  beforeEach(async () => {
    subject = mount(
      <Dashboard
        username="Tytus"
        missionRepository={new MissionRepositoryStub()}
        siteRepository={new SiteRepositoryStub()}
      />
    );
    await forIt();
    subject.update();

    missions = await missionRepositoryStub.findAll();
  });

  it('renders a Dashboard with all missions', () => {
    expect(subject.find(Mission).length).toBe(3);
    expect(dashboardMissions(subject)).toEqual(missions);
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('MPS DASHBOARD');
  });

  describe('filtering', () => {
    const siteId = 1;

    beforeEach(async () => {
      const filter = findFilterById(subject, 'site-filter');
      await selectOption(subject, filter, siteId);
    });

    it('can filter a dashboard by site', async () => {
      const filteredMissions = await missionRepositoryStub.findBySite(siteId);
      expect(dashboardMissions(subject)).toEqual(filteredMissions);
    });

  });
});

function dashboardMissions(wrapper: ReactWrapper) {
  return wrapper.find(Mission).map(mission => mission.props().mission);
}