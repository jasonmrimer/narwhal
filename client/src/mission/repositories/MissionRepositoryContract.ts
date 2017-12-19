import MissionRepository from './MissionRepository';

export default function MissionRepositoryContract(subject: MissionRepository) {

  describe('findAll', () => {
    it('returns all missions', async () => {
      const missions = await subject.findAll();
      expect(missions).toBeDefined();
      expect(missions.length).toBeGreaterThan(0);
    });
  });

}
