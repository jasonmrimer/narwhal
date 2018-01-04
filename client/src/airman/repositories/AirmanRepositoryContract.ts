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

  describe('findByCrew', () => {
    it('returns airmen filtered by crew', async () => {
      const airmen = await subject.findAll();
      expect(airmen).toBeDefined();

      const filteredAirmen = await subject.findByCrew(1);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);
      filteredAirmen.forEach(airman => {
        const crewIds = airman.crews.map(crew => crew.id);
        expect(crewIds.indexOf(1)).toBeGreaterThan(-1);
      });
    });
  });
}
