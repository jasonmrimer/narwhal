import { CurrencyChild, CurrencyStore } from './CurrencyStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import { AirmanCertificationModelFactory } from '../../airman/factories/AirmanCertificationModelFactory';
import { Repositories } from '../../utils/Repositories';

describe('CurrencyStore', () => {
  const skill = {
    id: 1,
    airmanId: 2,
    skillId: 3,
    type: SkillType.Certification,
    earnDate: moment(),
    expirationDate: moment()
  };
  let subject: CurrencyStore;
  let repos: Partial<Repositories>;

  beforeEach(() => {
    repos = {
      airmanRepository: {
        findBySiteId: jest.fn(),
        saveSkill: jest.fn(),
        saveAirman: jest.fn(),
        delete: jest.fn(),
        deleteSkill: jest.fn(),
        findOne: jest.fn(),
        updateShiftByFlightId: jest.fn(),
        updateScheduleByFlightId: jest.fn(),
      },

      ripItemRepository: {
        findBySelectedAirman: jest.fn(),
        updateAirmanRipItems: jest.fn()
      }
    };

    subject = new CurrencyStore(repos);
  });

  it('should open an skill form for create', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openCreateSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should open an skill form for edit', () => {
    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);

    subject.openEditSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillForm);
  });

  it('should close the skill form', () => {
    subject.openEditSkillForm();
    subject.closeSkillForm();

    expect(subject.currencyChild).toBe(CurrencyChild.SkillList);
  });

  it('should toggle pending delete', () => {
    const cert = AirmanCertificationModelFactory.build(1, 1);
    expect(subject.pendingDeleteSkill).toBeNull();

    subject.removeSkill(cert);
    expect(subject.pendingDeleteSkill).toBe(cert);

    subject.cancelPendingDelete();
    expect(subject.pendingDeleteSkill).toBeNull();
  });

  it('should open the RipItems form', () => {
    subject.openAirmanRipItemForm();
    expect(subject.currencyChild).toBe(CurrencyChild.RipItemForm);
  });

  describe('skill', () => {
    it('should save a skill', async () => {
      await subject.addSkill(skill);
      expect(repos.airmanRepository!.saveSkill).toHaveBeenCalledWith(skill);
    });

    it('should delete a skill', async () => {
      subject.removeSkill(skill);
      await subject.executePendingDelete();
      expect(repos.airmanRepository!.deleteSkill).toHaveBeenCalledWith(skill);
    });
  });

  describe('rip items', () => {
    it('should set rip items for an airman', async () => {
      await subject.setRipItemsForAirman(123);
      expect(repos.ripItemRepository!.findBySelectedAirman).toHaveBeenCalledWith(123);
    });
  });
});
