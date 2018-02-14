import { MissionRepository } from './MissionRepository';

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

}
