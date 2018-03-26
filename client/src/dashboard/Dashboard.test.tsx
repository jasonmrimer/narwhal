import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { MissionModel } from '../mission/models/MissionModel';
import { DashboardStore } from './stores/DashboardStore';
import { StyledMission } from '../mission/Mission';
import { MemoryRouter } from 'react-router';
import { StyledMissionCardSection } from './MissionCardSection';

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
      const section = subject.find('.next-24');
      expect(section.find('h2').text()).toBe('NEXT 24 HOURS');
      expect(section.find('.mission-card').length).toBe(2);
    });

    it('should render in one section the mission from more than 24 hours but less than 72 hours', () => {
      const section = subject.find('.next-72');
      expect(section.find('h2').text()).toBe('NEXT 72 HOURS');
      expect(section.find('.mission-card').length).toBe(2);
    });

    it('should render in one section the mission from more than 72 hours but less 7 days', () => {
      const section = subject.find('.this-week');
      expect(section.find('h2').text()).toBe('THIS WEEK');
      expect(section.find('.mission-card').length).toBe(1);
    });

    it('should render in one section the mission from more than 1 week but less 2 weeks', () => {
      const section = subject.find('.next-week');
      expect(section.find('h2').text()).toBe('NEXT WEEK');
      expect(section.find('.mission-card').length).toBe(1);
    });

    it('should render in one section the mission from more than 2 weeks but less 30 days', () => {
      const section = subject.find('.long-range');
      expect(section.find('h2').text()).toBe('LONG RANGE');
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