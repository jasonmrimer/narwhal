import { DashboardStore } from './DashboardStore';
import { MissionModel } from '../../mission/models/MissionModel';
import { DoubleRepositories } from '../../Repositories';

describe('DashboardStore', () => {
  const missionRepository = DoubleRepositories.missionRepository;

  let allMissions: MissionModel[];
  let subject: DashboardStore;

  beforeEach(async () => {
    allMissions = await missionRepository.findAll();
    subject = new DashboardStore(DoubleRepositories);
    await subject.hydrate();
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: 1, label: 'DMS-GA'},
      {value: 2, label: 'DMS-MD'},
      {value: 3, label: 'DMS-HI'}
    ]);
  });

  describe('filtering by site', () => {
    beforeEach(() => {
      subject.setSiteId(1);
    });

    it('returns missions for the site', () => {
      const filteredMissions: MissionModel[] = Object.keys(subject.missions).map(key => {
        return subject.missions[key];
      }).reduce((acc, val) => acc.concat(val), []);

      expect(filteredMissions.length).toBeLessThan(allMissions.length);
      expect(filteredMissions.map(msn => msn.site!.id)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1]);
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