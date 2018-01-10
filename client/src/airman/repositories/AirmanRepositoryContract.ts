import AirmanRepository from './AirmanRepository';
import * as moment from 'moment';

export default function airmenRepositoryContract(subject: AirmanRepository) {
  describe('findAll', () => {
    it('returns airmen', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      expect(airmen.length).toBeGreaterThan(0);

      const uniqueIds = airmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(airmen.length);

      airmen.forEach(({qualifications}) => {
        expect(qualifications.length).toBeGreaterThan(0);
        expect(moment.isMoment(qualifications[0].expirationDate)).toBeTruthy();
      });

      airmen.forEach(({certifications}) => {
        expect(certifications.length).toBeGreaterThan(0);
      });

      airmen.forEach(({events}) => {
        expect(events.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findBySquadron', () => {
    it('returns airmen filtered by squadron', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      const filteredAirmen = await subject.findBySquadron(1);
      expect(filteredAirmen).toBeDefined();

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);
    });
  });

  describe('findByFlight', () => {
    it('returns airmen filtered by flight', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      const filteredAirmen = await subject.findByFlight(1);

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);

      filteredAirmen.forEach(airman => {
        expect(airman.flightId).toEqual(1);
      });
    });
  });
}
