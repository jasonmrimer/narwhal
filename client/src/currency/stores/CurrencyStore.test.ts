import { CurrencyStore } from './CurrencyStore';
import { SkillActions } from '../../skills/stores/SkillActions';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import * as moment from 'moment';
import { SkillType } from '../../skills/models/SkillType';

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
  let subject: CurrencyStore;

  beforeEach(() => {
    skillActions = {
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      qualificationOptions: [],
      certificationOptions: []
    };
    subject = new CurrencyStore(new SkillFormStore(skillActions));
  });

  it('should show the skill form without a skill', () => {
    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeFalsy();

    subject.showSkillForm();

    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeTruthy();
  });

  it('should open an skill form for create', () => {
    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeFalsy();

    subject.openCreateSkillForm();

    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeTruthy();
  });

  it('should open an skill form for edit', () => {
    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeFalsy();

    subject.openEditSkillForm(skill);

    expect(subject.hasItem).toBeTruthy();
    expect(subject.shouldShowSkillForm).toBeTruthy();
  });

  it('should close the skill form', () => {
    subject.openEditSkillForm(skill);

    subject.closeSkillForm();

    expect(subject.hasItem).toBeFalsy();
    expect(subject.shouldShowSkillForm).toBeFalsy();
  });
});