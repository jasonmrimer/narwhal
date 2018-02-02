import AirmanRepository from './AirmanRepository';
import AirmanModel from '../models/AirmanModel';
import AirmanQualificationModel from '../models/AirmanQualificationModel';
import QualificationModel from '../../skills/models/QualificationModel';
import * as moment from 'moment';

export default function airmenRepositoryContract(subject: AirmanRepository) {
  let airmen: AirmanModel[];

  beforeEach(async () => {
    airmen = await subject.findAll();
    expect(airmen).toBeDefined();
  });

  describe('findAll', () => {
    it('returns airmen', () => {
      expect(airmen.length).toBeGreaterThan(0);

      const uniqueIds = airmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(airmen.length);

      airmen.forEach(({qualifications}) => {
        expect(Array.isArray(qualifications)).toBeTruthy();
      });

      airmen.forEach(({certifications}) => {
        expect(Array.isArray(certifications)).toBeTruthy();
      });

      airmen.forEach(({events}) => {
        expect(Array.isArray(events)).toBeTruthy();
      });
    });
  });

  describe('findBySquadron', () => {
    it('returns airmen filtered by squadron', async () => {
      const filteredAirmen = await subject.findBySquadron(1);
      expect(filteredAirmen).toBeDefined();

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);
    });
  });

  describe('findByFlight', () => {
    it('returns airmen filtered by flight', async () => {
      const filteredAirmen = await subject.findByFlight(1);

      const uniqueIds = filteredAirmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(filteredAirmen.length);

      expect(filteredAirmen.length).toBeLessThan(airmen.length);

      filteredAirmen.forEach(airman => {
        expect(airman.flightId).toEqual(1);
      });
    });
  });

  describe('saveQualification', () => {
    it('saves a qualification with a unique id', async () => {
      const qualId = 3;
      const qualification = new AirmanQualificationModel(
        airmen[0].id,
        new QualificationModel(qualId, 'A', 'A'),
        moment.utc(),
        moment.utc()
      );
      const airman = await subject.saveQualification(qualification);
      expect(airman.qualifications.find(q => q.qualification.id === qualId)!.id).toBeDefined();
    });
  });
}
