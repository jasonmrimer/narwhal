import { CurrencyChild, CurrencyStore } from './CurrencyStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import { DoubleRepositories } from '../../Repositories';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { AirmanQualificationModel } from '../../airman/models/AirmanQualificationModel';

describe('CurrencyStore', () => {
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
    allAirmen = await airmanRepository.findAll();

    const refreshAirmen = {
      refreshAirmen: jest.fn()
    };

    const selectedSiteContainer = {
      selectedSite: 1
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

      const updatedAirman = (await airmanRepository.findAll())[0];
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

      const updatedAirman = (await airmanRepository.findAll())[0];
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

      let updatedAirman = (await airmanRepository.findAll())[0];
      const qualLength = updatedAirman.qualifications.length;
      const id = updatedAirman.qualifications.find((q: AirmanQualificationModel) => q.skillId === 100)!.id;

      await subject.removeSkill(Object.assign({}, newSkill, {id}));

      updatedAirman = (await airmanRepository.findAll())[0];
      expect(updatedAirman.qualifications.length).toBeLessThan(qualLength);
    });
  });
});
