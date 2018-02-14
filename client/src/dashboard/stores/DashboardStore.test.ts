import { DashboardStore } from './DashboardStore';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { SiteRepositoryStub } from '../../site/repositories/doubles/SiteRepositoryStub';
import { MissionModel } from '../../mission/models/MissionModel';
import { toJS } from 'mobx';

describe('DashboardStore', () => {
  const missionRepository = new MissionRepositoryStub();
  const siteRepository = new SiteRepositoryStub();
  let allMissions: MissionModel[];
  let subject: DashboardStore;

  beforeEach(async () => {
    allMissions = await missionRepository.findAll();
    subject = new DashboardStore(missionRepository, siteRepository);
    await subject.hydrate();
  });

  it('returns all missions', () => {
    expect(toJS(subject.missions)).toEqual(allMissions);
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: 1, label: 'Site 1'},
      {value: 2, label: 'Site 2'}
    ]);
  });

  describe('filtering by site', () => {
    beforeEach(() => {
      subject.setSiteId(1);
    });

    it('returns missions for the site', () => {
      const filteredMissions = subject.missions;
      expect(filteredMissions.length).toBeLessThan(allMissions.length);
      expect(filteredMissions.map(msn => msn.site!.id)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1]);
    });
  });
});