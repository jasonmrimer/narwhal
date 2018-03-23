import { CurrencyChild, CurrencyStore } from './CurrencyStore';
import { SkillActions } from '../../skills/stores/SkillActions';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';
import { RipItemRepositoryStub } from '../../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';

describe('CurrencyStore', () => {
  const skill = {
    id: 1,
    airmanId: 2,
    skillId: 3,
    type: SkillType.Certification,
    earnDate: moment(),
    expirationDate: moment()
  };

  let skillActions: SkillActions;
  let ripItemRepository: RipItemRepository;
  let subject: CurrencyStore;

  beforeEach(() => {
    ripItemRepository = new RipItemRepositoryStub();

    skillActions = {
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      siteId: 1
    };

    subject = new CurrencyStore(new SkillFormStore(skillActions), ripItemRepository);
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
});
