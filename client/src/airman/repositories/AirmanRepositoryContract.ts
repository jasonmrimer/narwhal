import { AirmanRepository } from './AirmanRepository';
import { AirmanModel, ShiftType } from '../models/AirmanModel';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import * as assert from 'assert';

export function airmanRepositoryContract(subject: AirmanRepository) {
  const siteId = 14;
  let airmen: AirmanModel[];

  beforeEach(async () => {
    airmen = await subject.findBySiteId(siteId);
    expect(airmen).toBeDefined();
  });

  describe('findOne', () => {
    it('returns an Airman', async () => {
      const airman = await subject.findOne(airmen[0].id);
      expect(airman).toBeDefined();
    });
  });

  describe('findBySiteId', () => {
    it('returns airmen', () => {
      expect(airmen.length).toBeGreaterThan(0);

      const uniqueIds = airmen.map(airman => airman.id).filter((el, i, a) => i === a.indexOf(el));
      expect(uniqueIds.length).toEqual(airmen.length);

      const siteIds = airmen.map(airman => airman.siteId);
      expect(siteIds.every(id => id === siteId)).toBeTruthy();

      airmen.forEach(({shift}) => {
        expect(shift).toBeDefined();
      });

      airmen.forEach(({qualifications}) => {
        expect(Array.isArray(qualifications)).toBeTruthy();
      });

      airmen.forEach(({certifications}) => {
        expect(Array.isArray(certifications)).toBeTruthy();
      });
    });
  });

  describe('save', () => {
    it('saves a certification with a unique id', async () => {
      const certId = 3;
      const airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });
      expect(airman.certifications.find(c => c.certification.id === certId)!.id).toBeDefined();
    });

    it('updates expiration date of the certification', async () => {
      const certId = 3;
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });

      const savedCert = airman.certifications.find(c => c.certification.id === certId)!;
      const newPeriodicDue = savedCert.periodicDue.add(1, 'year');
      const newCurrencyExpiration = savedCert.currencyExpiration.add(1, 'year');
      const newLastSat = savedCert.lastSat.add(1, 'year');

      airman = await subject.saveSkill({
        id: savedCert.id,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: certId,
        earnDate: savedCert.earnDate,
        periodicDue: newPeriodicDue,
        currencyExpiration: newCurrencyExpiration,
        lastSat: newLastSat
      });

      expect(airman.certifications
        .find(c => c.certification.id === certId)!
        .periodicDue.isSame(newPeriodicDue))
        .toBeTruthy();

      expect(airman.certifications
        .find(c => c.certification.id === certId)!
        .currencyExpiration.isSame(newCurrencyExpiration))
        .toBeTruthy();

      expect(airman.certifications
        .find(c => c.certification.id === certId)!
        .lastSat.isSame(newLastSat))
        .toBeTruthy();
    });

    it('saves a qualification with a unique id', async () => {
      const qualId = 3;
      const airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });
      expect(airman.qualifications.find(q => q.qualification.id === qualId)!.id).toBeDefined();
    });

    it('updates expiration date of the qualification', async () => {
      const qualId = 4;
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });

      const savedQual = airman.qualifications.find(q => q.qualification.id === qualId)!;
      const newPeriodicDue = savedQual.periodicDue.add(1, 'year');
      const newCurrencyExpiration = savedQual.currencyExpiration.add(1, 'year');
      const newLastSat = savedQual.lastSat.add(1, 'year');

      airman = await subject.saveSkill({
        id: savedQual.id,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: qualId,
        earnDate: savedQual.earnDate,
        periodicDue: newPeriodicDue,
        currencyExpiration: newCurrencyExpiration,
        lastSat: newLastSat
      });

      expect(airman.qualifications
        .find(q => q.qualification.id === qualId)!
        .periodicDue.isSame(newPeriodicDue))
        .toBeTruthy();

      expect(airman.qualifications
        .find(q => q.qualification.id === qualId)!
        .currencyExpiration.isSame(newCurrencyExpiration))
        .toBeTruthy();

      expect(airman.qualifications
        .find(q => q.qualification.id === qualId)!
        .lastSat.isSame(newLastSat))
        .toBeTruthy();
    });

    it('updates an airman with a new shift', async () => {
      let airman = airmen[0];
      airman.shift = ShiftType.Night;

      const updatedAirman = await subject.saveAirman(airman);

      expect(updatedAirman.shift).toBe(ShiftType.Night);
    });

    describe('validation', () => {
      it('correctly handles validations from the server', async () => {
        const qualId = 5;
        const errors =  {
          "currencyExpiration": "This field is required.",
          "earnDate": "This field is required.",
          "lastSat": "This field is required.",
          "periodicDue": "This field is required."
        };

        try {
          await subject.saveSkill({
            id: null,
            type: SkillType.Qualification,
            airmanId: airmen[0].id,
            skillId: qualId,
            earnDate: moment.invalid(),
            periodicDue: moment.invalid(),
            currencyExpiration: moment.invalid(),
            lastSat: moment.invalid()
          });
        } catch (e) {
          expect(e).toEqual(errors);
          return;
        }
        assert.fail('saveSkill should have returned validation errors');
      });
    });
  });

  describe('delete', () => {
    it('deletes the selected qualification from the airman', async () => {
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });
      const savedSkill = airman.qualifications.find(q => q.skillId === 1)!;

      const updatedAirman = await subject.deleteSkill({
        id: savedSkill.id,
        type: SkillType.Qualification,
        airmanId: airmen[0].id,
        skillId: 1,
        earnDate: savedSkill.earnDate,
        periodicDue: savedSkill.periodicDue,
        currencyExpiration: savedSkill.currencyExpiration,
        lastSat: savedSkill.lastSat
      });
      expect(updatedAirman.qualifications.find(q => q.id === savedSkill.id)).toBeUndefined();
    });

    it('deletes the selected certification from the airman', async () => {
      let airman = await subject.saveSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: 4,
        earnDate: moment(),
        periodicDue: moment(),
        currencyExpiration: moment(),
        lastSat: moment()
      });
      const savedSkill = airman.certifications.find(c => c.skillId === 4)!;

      const updatedAirman = await subject.deleteSkill({
        id: savedSkill.id,
        type: SkillType.Certification,
        airmanId: airmen[0].id,
        skillId: 4,
        earnDate: savedSkill.earnDate,
        periodicDue: savedSkill.periodicDue,
        currencyExpiration: savedSkill.currencyExpiration,
        lastSat: savedSkill.lastSat
      });
      expect(updatedAirman.certifications.find(c => c.id === savedSkill.id)).toBeUndefined();
    });
  });
}
