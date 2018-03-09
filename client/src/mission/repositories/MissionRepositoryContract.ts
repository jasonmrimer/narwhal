import { MissionRepository } from './MissionRepository';
import * as moment from 'moment';

export function MissionRepositoryContract(subject: MissionRepository) {

  describe('findAll', () => {
    it('returns all missions', async () => {
      const missions = await subject.findAll();
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThan(0);
      const uniqueIds = missions.map(msn => msn.missionId).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(missions.length);
    });
  });

  describe('findBySite', () => {
    it('returns all missions that match that site', async () => {
      const missions = await subject.findBySite(1);
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThan(0);
      const uniqueIds = missions.map(msn => msn.missionId).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(missions.length);
      const sites = missions.map(msn => msn.site).filter((el, i, a) => i === a.indexOf(el));
      expect(sites[0]!.id).toBe(1);
    });
  });

  describe('findAllFromTodayOn', () => {
    it('returns all missions on or after todays date', async () => {
      const missions = await subject.findAllFromTodayOn();
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThan(0);
      const uniqueIds = missions.map(msn => msn.missionId).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(missions.length);

      const missionStartDates = missions.filter(msn => msn.startDateTime.isAfter(moment().subtract(1, 'days')))
        .map(msn => msn.startDateTime);
      expect(missionStartDates.length).toEqual(4);
    });
  });
}
