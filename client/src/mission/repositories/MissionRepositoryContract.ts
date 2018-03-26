import { MissionRepository } from './MissionRepository';
import * as moment from 'moment';

export function MissionRepositoryContract(subject: MissionRepository) {
  describe('findAll', () => {
    it('returns all missions on or after todays date', async () => {
      const missions = await subject.findAll();
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThan(0);
      const uniqueIds = missions.map(msn => msn.missionId).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(missions.length);

      const missionStartDates = missions.filter(msn => msn.startDateTime.isAfter(moment().subtract(1, 'days')))
        .map(msn => msn.startDateTime);
      expect(missionStartDates.length).toEqual(19);
    });
  });
}
