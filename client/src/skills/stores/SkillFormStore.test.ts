import { SkillFormStore } from './SkillFormStore';
import { SkillActions } from './SkillActions';
import { Skill } from '../models/Skill';
import { SkillType } from '../models/SkillType';
import * as moment from 'moment';
import { CertificationModelFactory } from '../factories/CertificationModelFactory';
import { QualificationModelFactory } from '../factories/QualificationModelFactory';

describe('SkillFormStore', () => {
  const airmanId = 123;
  const skill: Skill = {
    id: 1,
    type: SkillType.Qualification,
    airmanId: airmanId,
    skillId: 2,
    earnDate: moment(),
    expirationDate: moment()
  };

  let skillActions: SkillActions;
  let subject: SkillFormStore;

  beforeEach(() => {
    skillActions = {
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      siteId: 1
    };

    const certifications = [
      ...CertificationModelFactory.buildList(3, 1),
      ...CertificationModelFactory.buildList(3, 2)
    ];
    const qualifications = QualificationModelFactory.buildList(3);

    subject = new SkillFormStore(skillActions);
    subject.hydrate(certifications, qualifications);
  });

  it('should set the skillId when setting the skillType', () => {
    subject.setState({skillType: SkillType.Qualification});
    expect(subject.state.skillId).toEqual('0');

    subject.setState({skillType: SkillType.Certification});
    expect(subject.state.skillId).toEqual('0');
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasItem).toBeFalsy();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('0');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given skill', () => {
      subject.open(skill);
      expect(subject.hasItem).toBeTruthy();
      expect(subject.state.skillType).toBe(skill.type);
      expect(subject.state.skillId).toBe(String(skill.skillId));
      expect(subject.state.earnDate).toBe(skill.earnDate.format('YYYY-MM-DD'));
      expect(subject.state.expirationDate).toBe(skill.expirationDate.format('YYYY-MM-DD'));
      expect(subject.errors.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(skill);
      expect(subject.hasItem).toBeTruthy();

      subject.close();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('0');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasItem).toBeFalsy();
    });
  });

  it('can add an skill', () => {
    subject.setState({
      skillType: skill.type,
      skillId: String(skill.skillId),
      earnDate: skill.earnDate.format('YYYY-MM-DD'),
      expirationDate: skill.expirationDate.format('YYYY-MM-DD'),
    });

    subject.addItem(airmanId);

    const addedSkill = (skillActions.addSkill as jest.Mock).mock.calls[0][0];
    expect(addedSkill.skillId).toEqual(skill.skillId);
  });

  it('can remove an skill', () => {
    subject.open(skill);

    subject.removeItem();

    expect(skillActions.removeSkill).toHaveBeenCalledWith(skill);
  });

  it('should render certification options based off the site of the selected airman', () => {
    expect(subject.certificationOptions.length).toBe(3);
  });
});
