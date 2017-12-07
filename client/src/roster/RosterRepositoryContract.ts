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
}
