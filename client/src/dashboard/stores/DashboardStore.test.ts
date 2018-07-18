import { DashboardStore } from './DashboardStore';
import { MissionModel } from '../../mission/models/MissionModel';
import { DoubleRepositories } from '../../utils/Repositories';

describe('DashboardStore', () => {
  const missionRepository = DoubleRepositories.missionRepository;

  let allMissions: MissionModel[];
  let subject: DashboardStore;

  const filteredMissions = (missionList: any) => {
    return Object.keys(missionList).map(key => {
      return missionList[key];
    }).reduce((acc, val) => acc.concat(val), []) as MissionModel[];
  };

  beforeEach(async () => {
    allMissions = await missionRepository.findAll();
    subject = new DashboardStore(DoubleRepositories);
    await subject.hydrate();
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: -1, label: 'All Sites'},
      {value: 14, label: 'DMS-GA'},
      {value: 2, label: 'DMS-MD'},
      {value: 3, label: 'DMS-HI'}
    ]);
  });

  it('returns a list of platform options given a site', async () => {
    await subject.setSelectedSite(1);
    expect(subject.platformOptions.length).toBe(1);
    expect(subject.platformOptions[0]).toEqual({value: 0, label: 'U-2'});
  });

  it('returns a list of platform options for all sites', async () => {
    await subject.setSelectedSite(null);

    expect(subject.platformOptions.length).toBe(2);
    expect(subject.platformOptions[0]).toEqual({value: 0, label: 'U-2'});
    expect(subject.platformOptions[1]).toEqual({value: 1, label: 'Global Hawk'});
  });

  describe('filtering ', () => {
    it('returns missions for the site', async () => {
      await subject.setSelectedSite(1);
      const missions = filteredMissions(subject.missions);

      expect(missions.length).toBe(2);
      expect(missions.map(msn => msn.site!.id)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1]);
    });

    it('should return missions for all sites', async () => {
      await subject.setSelectedSite(null);

      const missions = filteredMissions(subject.missions);

      expect(missions.length).toBe(19);
      console.log(missions);
      // console.log(missions.map(msn => msn.site!.id).filter((el, i, a) => console.log(a)));
      expect(missions.map(msn => msn.site!.id)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1, 2, 3]);
    });

    it('returns missions filtered by the selected platform', async () => {
      await subject.setSelectedSite(3);

      subject.setSelectedPlatformOptions([]);
      let missions = filteredMissions(subject.missions);
      expect(missions.length).toBe(15);

      subject.setSelectedPlatformOptions([{value: 0, label: 'U-2'}]);
      missions = filteredMissions(subject.missions);
      expect(missions.length).toBe(9);

      subject.setSelectedPlatformOptions([{value: 0, label: 'U-2'}, {value: 1, label: 'Global Hawk'}]);
      missions = filteredMissions(subject.missions);
      expect(missions.length).toBe(15);
    });

    it('should return missions based on matching ato mission number', () => {
      subject.handleFilterMission('ato1');
      const missions = filteredMissions(subject.missions);
      expect(missions.length).toBe(11);
    });
  });

  it('organizes missions by time interval', () => {
    const expectedMissions = {
      'NEXT 24 HOURS': [allMissions[0], allMissions[1]],
      'NEXT 72 HOURS': [allMissions[2], allMissions[3]],
      'THIS WEEK': [allMissions[4]],
      'NEXT WEEK': [allMissions[5]],
      'LONG RANGE': allMissions.splice(6, 19)
    };

    expect(subject.missions).toEqual(expectedMissions);
  });
});
