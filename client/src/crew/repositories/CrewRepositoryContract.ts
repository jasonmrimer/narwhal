import CrewRepository from './CrewRepository';

export default function CrewRepositoryContract(subject: CrewRepository) {
  describe('findAll', () => {
    it('returns all crews', async () => {
      const crews = await subject.findAll();
      expect(crews).toBeDefined();
      expect(crews.length).toBeGreaterThan(0);
      const uniqueIds = crews.map(crew => crew.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(crews.length);
    });
  });
}
