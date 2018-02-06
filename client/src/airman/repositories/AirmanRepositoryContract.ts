import AirmanRepository from './AirmanRepository';
import AirmanModel from '../models/AirmanModel';
import AirmanQualificationModel from '../models/AirmanQualificationModel';
import QualificationModel from '../../skills/models/QualificationModel';
import * as moment from 'moment';
import AirmanCertificationModel from '../models/AirmanCertificationModel';
import CertificationModel from '../../skills/models/CertificationModel';

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

    it('updates expiration date of the qualification', async () => {
      const qualId = 4;
      const newQual = new AirmanQualificationModel(
        airmen[0].id,
        new QualificationModel(qualId, 'A', 'A'),
        moment.utc(),
        moment.utc()
      );

      let airman = await subject.saveQualification(newQual);
      const savedQual = airman.qualifications.find(q => q.qualification.id === qualId)!;
      const newExpirationDate = savedQual.expirationDate.add(1, 'year').utc();

      airman = await subject.saveQualification(savedQual);
      expect(airman.qualifications
        .find(q => q.qualification.id === qualId)!
        .expirationDate.isSame(newExpirationDate))
        .toBeTruthy();
    });
  });

  describe('saveCertification', () => {
    it('saves a certification with a unique id', async () => {
      const certId = 3;
      const certification = new AirmanCertificationModel(
        airmen[0].id,
        new CertificationModel(certId, 'A'),
        moment.utc(),
        moment.utc()
      );
      const airman = await subject.saveCertification(certification);
      expect(airman.certifications.find(c => c.certification.id === certId)!.id).toBeDefined();
    });

    it('updates expiration date of the certification', async () => {
      const certId = 3;
      const newCert = new AirmanCertificationModel(
        airmen[0].id,
        new CertificationModel(certId, 'A'),
        moment.utc(),
        moment.utc()
      );

      let airman = await subject.saveCertification(newCert);
      const savedCert = airman.certifications.find(c => c.certification.id === certId)!;
      const newExpirationDate = savedCert.expirationDate.add(1, 'year').utc();

      airman = await subject.saveCertification(savedCert);
      expect(airman.certifications
        .find(c => c.certification.id === certId)!
        .expirationDate.isSame(newExpirationDate))
        .toBeTruthy();
    });
  });
}
