import AirmanRepository from './AirmanRepository';

export default function airmenRepositoryContract(subject: AirmanRepository) {
  describe('findAll', () => {
    it('returns a airmen', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      expect(airmen.length).toBeGreaterThan(0);

      airmen.forEach(({qualifications}) => {
        expect(qualifications.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findByUnit', () => {
    it('returns a airmen with airmen filtered by unit', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      const filteredAirmen = await subject.findByUnit(1);
      expect(filteredAirmen).toBeDefined();

      expect(filteredAirmen.length).toBeLessThan(airmen.length);
      filteredAirmen.forEach(airman => expect(airman.unit.id).toBe(1));
    });
  });
}
