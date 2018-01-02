import * as React from 'react';
import { Dashboard } from './Dashboard';
import { mount, ReactWrapper } from 'enzyme';
import MissionRepositoryStub from '../mission/repositories/doubles/MissionRepositoryStub';
import Mission from '../mission/Mission';
import { forIt } from '../utils/testUtils';
import TopBar from '../widgets/TopBar';
import { Filter } from '../widgets/Filter';
import SiteRepositoryStub from '../site/repositories/doubles/SiteRepositoryStub';
import { MissionModel } from '../mission/models/MissionModel';

const missionRepositoryStub = new MissionRepositoryStub();

let subject: ReactWrapper, missions: MissionModel[];
// TODO inject subject instead of making global variable
function dashboardMissions() {
  let missionCards: MissionModel[];
  missionCards = [];
  subject.find(Mission).map((mission) => {
    missionCards.push(mission.props().mission);
  });
  return missionCards;
}

describe('Dashboard', () => {
  beforeEach(async () => {
    subject = mount(
      <Dashboard
        username="Tytus"
        missionRepository={new MissionRepositoryStub()}
        siteRepository={new SiteRepositoryStub()}
      />
    );
    missions = await missionRepositoryStub.findAll();
    await forIt();
    subject.update();
  });

  it('renders a Dashboard with all missions', async () => {
    await forIt();
    subject.update();
    expect(subject.find(Mission).length).toBe(3);
    expect(dashboardMissions()).toEqual(missions);
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('MPS DASHBOARD');
  });

  describe('filtering', () => {
    const siteId = 1;
    let filter: ReactWrapper;

    beforeEach(async () => {
      filter = subject.find(Filter);
      filter.simulate('change', {target: {value: siteId}});
      missions = [];
      await forIt();
      subject.update();
    });

    it('can filter a dashboard by site', async () => {
      missions = await missionRepositoryStub.findBySite(siteId);
      expect(dashboardMissions()).toEqual(missions);
    });

  });
});