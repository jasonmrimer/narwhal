import CrewRepository from './CrewRepository';

export default function CrewRepositoryContract(subject: CrewRepository) {
  describe('findAll', () => {
    it('returns all sites', async () => {
      const crews = await subject.findAll();
      expect(crews).toBeDefined();
      expect(crews.length).toBeGreaterThan(0);
    });
  });
}
