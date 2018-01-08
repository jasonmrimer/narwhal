import UnitRepository from './UnitRepository';

export default function unitRepositoryContract(subject: UnitRepository) {
  describe('findAll', () => {
    it('returns all units', async () => {
      const units = await subject.findAll();
      expect(units).toBeDefined();
      expect(units.length).toBeGreaterThan(0);
      const uniqueIds = units.map(unit => unit.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(units.length);
    });
  });
}