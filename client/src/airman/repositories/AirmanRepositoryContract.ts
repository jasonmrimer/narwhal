import AirmanRepository from './AirmanRepository';
import * as moment from 'moment';

export default function airmenRepositoryContract(subject: AirmanRepository) {
  describe('findAll', () => {
    it('returns a airmen', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      expect(airmen.length).toBeGreaterThan(0);
      airmen.forEach(({qualifications}) => {
        expect(qualifications.length).toBeGreaterThan(0);
        expect(moment.isMoment(qualifications[0].expirationDate)).toBeTruthy();
      });

      airmen.forEach(({certifications}) => {
        expect(certifications.length).toBeGreaterThan(0);
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
      filteredAirmen.forEach(airman => {
        if (airman.unit) {
          expect(airman.unit.id).toBe(1);
        }
      });
    });
  });
}
