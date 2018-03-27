import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import { MissionModel } from '../mission/models/MissionModel';
import { DashboardStore } from './stores/DashboardStore';
import { StyledMission } from '../mission/Mission';
import { MemoryRouter } from 'react-router';
import { DoubleRepositories } from '../Repositories';
import { StyledMissionCardSection } from './MissionCardSection';

const missionRepositoryStub = DoubleRepositories.missionRepository;

describe('Dashboard', () => {
  let missions: MissionModel[];
  let subject: ReactWrapper;

  beforeEach(async () => {
    missions = await missionRepositoryStub.findAll();

    const dashboardStore = new DashboardStore(DoubleRepositories);

    subject = mount(
      <MemoryRouter>
        <Dashboard
          username="Tytus"
          dashboardStore={dashboardStore}
        />
      </MemoryRouter>
    );
    await forIt();
    subject.update();
  });

  it('renders a Dashboard with all missions', () => {
    expect(subject.find('.mission-card').length).toBe(19);
    expect(dashboardMissions(subject)).toEqual(missions);
  });

  describe('sorting', () => {
    it('should render 5 Mission Card Sections', () => {
      expect(subject.find(StyledMissionCardSection).length).toBe(5);
    });

    it('should render in one section the mission for only the next 24 hours', () => {
      const section = subject.find(StyledMissionCardSection).at(0);
      expect(section.find('h2').text()).toContain('NEXT 24 HOURS');
      expect(section.find('.mission-card').length).toBe(2);
    });

    it('should render in one section the mission from more than 24 hours but less than 72 hours', () => {
      const section = subject.find(StyledMissionCardSection).at(1);
      expect(section.find('h2').text()).toContain('NEXT 72 HOURS');
      expect(section.find('.mission-card').length).toBe(2);
    });

    it('should render in one section the mission from more than 72 hours but less 7 days', () => {
      const section = subject.find(StyledMissionCardSection).at(2);
      expect(section.find('h2').text()).toContain('THIS WEEK');
      expect(section.find('.mission-card').length).toBe(1);
    });

    it('should render in one section the mission from more than 1 week but less 2 weeks', () => {
      const section = subject.find(StyledMissionCardSection).at(3);
      expect(section.find('h2').text()).toContain('NEXT WEEK');
      expect(section.find('.mission-card').length).toBe(1);
    });

    it('should render in one section the mission from more than 2 weeks but less 30 days', () => {
      const section = subject.find(StyledMissionCardSection).at(4);
      expect(section.find('h2').text()).toContain('LONG RANGE');
      expect(section.find('.mission-card').length).toBe(13);
    });
  });

  describe('filtering', () => {
    const siteId = 1;

    beforeEach(async () => {
      const filter = findFilterById(subject, 'site-filter');
      await selectOption(subject, filter, siteId);
    });

    it('can filter a dashboard by site', () => {
      dashboardMissions(subject).map(mission => {
        expect(mission.site!.id).toEqual(siteId);
      });
    });
  });
});

function dashboardMissions(wrapper: ReactWrapper) {
  return wrapper.find(StyledMission).map(mission => mission.props().mission);
}