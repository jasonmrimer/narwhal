import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { MissionModel } from '../mission/models/MissionModel';
import { DashboardStore } from './stores/DashboardStore';
import { StyledMission } from '../mission/Mission';

const missionRepositoryStub = new MissionRepositoryStub();

describe('Dashboard', () => {
  let missions: MissionModel[];
  let subject: ReactWrapper;

  beforeEach(async () => {
    missions = await missionRepositoryStub.findAll();

    const dashboardStore = new DashboardStore(
      new SiteRepositoryStub(),
      new MissionRepositoryStub()
    );

    subject = mount(
      <Dashboard
        username="Tytus"
        dashboardStore={dashboardStore}
      />
    );
    await forIt();
    subject.update();
  });

  it('renders a Dashboard with all missions', () => {
    expect(subject.find('.mission-card').length).toBe(3);
    expect(dashboardMissions(subject)).toEqual(missions);
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
  return wrapper.find(StyledMission).map(mission => mission.props().mission);
}