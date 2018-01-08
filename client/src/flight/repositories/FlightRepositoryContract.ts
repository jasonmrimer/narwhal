import FlightRepository from './FlightRepository';

export default function FlightRepositoryContract(subject: FlightRepository) {
  describe('findAll', () => {
    it('returns all flights', async () => {
      const flights = await subject.findAll();
      expect(flights).toBeDefined();
      expect(flights.length).toBeGreaterThan(0);
      const uniqueIds = flights.map(flight => flight.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(flights.length);
    });
  });
}
