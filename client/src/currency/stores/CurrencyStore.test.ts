import { CurrencyChild, CurrencyStore } from './CurrencyStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import { DoubleRepositories } from '../../utils/Repositories';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { AirmanQualificationModel } from '../../airman/models/AirmanQualificationModel';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';

describe('CurrencyStore', () => {
  const siteId = 14;
  const airmanRepository = (DoubleRepositories.airmanRepository as FakeAirmanRepository);
  let allAirmen: AirmanModel[];

  const skill = {
    id: 1,
    airmanId: 2,
    skillId: 3,
    type: SkillType.Certification,
    earnDate: moment(),
    expirationDate: moment()
  };

  let subject: CurrencyStore;

  beforeEach(async () => {
    allAirmen = await airmanRepository.findBySiteId(siteId);

    const refreshAirmen = {
      refreshAirmen: jest.fn()
    };

    const selectedSiteContainer = {
      selectedSite: siteId
    };

    subject = new CurrencyStore(refreshAirmen, selectedSiteContainer, DoubleRepositories);
  });

  it('should open an skill form for create', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openCreateSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should open an skill form for edit', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openEditSkillForm(skill);

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should close the skill form', () => {
    subject.openEditSkillForm(skill);
    subject.closeSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);
  });

  it('should toggle pending delete', () => {
    const cert = AirmanCertificationModelFactory.build(1, 1);
    expect(subject.pendingDeleteSkill).toBeNull();

    subject.setPendingDeleteSkill(cert);
    expect(subject.pendingDeleteSkill).toBe(cert);

    subject.setPendingDeleteSkill(null);
    expect(subject.pendingDeleteSkill).toBeNull();
  });

  it('should open the RipItems form', () => {
    subject.openAirmanRipItemForm();
    expect(subject.currencyChild).toBe(CurrencyChild.RipItemForm);
  });

  describe('skill', () => {
    it('should add a qualification to an airman', async () => {
      const airman = allAirmen[0];
      const qualLength = airman.qualifications.length;

      await subject.addSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      });

      const updatedAirman = (await airmanRepository.findBySiteId(siteId))[0];
      expect(updatedAirman.qualifications.length).toBeGreaterThan(qualLength);
    });

    it('should add a certification to an airman', async () => {
      const airman = allAirmen[0];
      const certLength = airman.certifications.length;

      await subject.addSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      });

      const updatedAirman = (await airmanRepository.findBySiteId(siteId))[0];
      expect(updatedAirman.certifications.length).toBeGreaterThan(certLength);
    });

    it('should delete a qualification from the airman', async () => {
      const airman = allAirmen[0];
      const newSkill = {
        id: null,
        type: SkillType.Qualification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      };

      await subject.addSkill(newSkill);

      let updatedAirman = (await airmanRepository.findBySiteId(siteId))[0];
      const qualLength = updatedAirman.qualifications.length;
      const id = updatedAirman.qualifications.find((q: AirmanQualificationModel) => q.skillId === 100)!.id;
      subject.setPendingDeleteSkill(Object.assign({}, newSkill, {id}));
      await subject.removeSkill();

      updatedAirman = (await airmanRepository.findBySiteId(siteId))[0];
      expect(updatedAirman.qualifications.length).toBeLessThan(qualLength);
      expect(subject.pendingDeleteSkill).toBeNull();
    });
  });
});
