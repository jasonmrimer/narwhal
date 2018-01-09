import SquadronRepository from './SquadronRepository';

export default function squadronRepositoryContract(subject: SquadronRepository) {
  describe('findAll', () => {
    it('returns all squadrons', async () => {
      const squadrons = await subject.findAll();
      expect(squadrons).toBeDefined();
      expect(squadrons.length).toBeGreaterThan(0);
      const uniqueIds = squadrons.map(squadron => squadron.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(squadrons.length);
    });
  });
}