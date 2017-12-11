import RosterRepository from './RosterRepository';

export default function rosterRepositoryContract(subject: RosterRepository) {
  describe('findOne', () => {
    it('returns a roster', async () => {
      const roster = await subject.findOne();
      expect(roster).toBeDefined();

      const {airmen} = roster;
      expect(airmen.length).toBeGreaterThan(0);
      airmen.forEach(({qualifications}) => {
        expect(qualifications.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findByUnit', () => {
    it('returns a roster with airmen filtered by unit', async () => {
      const roster = await subject.findOne();
      expect(roster).toBeDefined();

      const filteredRoster = await subject.findByUnit(1);
      expect(filteredRoster).toBeDefined();

      expect(filteredRoster.airmen.length).toBeLessThan(roster.airmen.length);
      filteredRoster.airmen.forEach(airman => expect(airman.unit.id).toBe(1));
    });
  });
}
