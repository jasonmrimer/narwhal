import { SkillActions, SkillFormStore } from './SkillFormStore';
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
    const siteIdContainer = {
      selectedSite: 1
  };

    skillActions = {
      addSkill: jest.fn(),
      setPendingDeleteSkill: jest.fn(),
    };

    const certifications = [
      ...CertificationModelFactory.buildList(3, 1),
      ...CertificationModelFactory.buildList(3, 2)
    ];
    const qualifications = QualificationModelFactory.buildList(3);

    subject = new SkillFormStore(siteIdContainer, skillActions);
    subject.hydrate(certifications, qualifications);
  });

  it('should set the skillId when setting the skillType', () => {
    subject.setState('skillType', SkillType.Qualification);
    expect(subject.state.skillId).toEqual('0');

    subject.setState('skillType', SkillType.Certification);
    expect(subject.state.skillId).toEqual('0');
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasModel).toBeFalsy();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('0');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given skill', () => {
      subject.open(skill);
      expect(subject.hasModel).toBeTruthy();
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
      expect(subject.hasModel).toBeTruthy();

      subject.close();
      expect(subject.state.skillType).toBe(SkillType.Qualification);
      expect(subject.state.skillId).toBe('0');
      expect(subject.state.earnDate).toBe('');
      expect(subject.state.expirationDate).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add a skill', () => {
    subject.setState('skillType', skill.type);
    subject.setState('skillId', String(skill.skillId));

    subject.addModel(airmanId);

    const addedSkill = (skillActions.addSkill as jest.Mock).mock.calls[0][0];
    expect(addedSkill.skillId).toEqual(skill.skillId);
  });

  it('should set the expirationDate 24 months ahead when adding an earnDate for quals', () => {
    subject.setState('skillType', SkillType.Qualification);
    subject.setState('earnDate', skill.earnDate.format('YYYY-MM-DD'));
    expect(subject.state.expirationDate).toBe(skill.earnDate.clone().startOf('day').add(2, 'y').format('YYYY-MM-DD'));
  });

  it('should set the expirationDate 90 days ahead when adding an earnDate for certs', () => {
    subject.setState('skillType', SkillType.Certification);
    subject.setState('earnDate', skill.earnDate.format('YYYY-MM-DD'));
    expect(subject.state.expirationDate).toBe(skill.earnDate.clone().startOf('day').add(90, 'd').format('YYYY-MM-DD'));
  });

  it('should not set the expirationDate when adding a blank earnDate for quals', () => {
    subject.setState('skillType', SkillType.Qualification);
    subject.setState('earnDate', '');
    expect(subject.state.expirationDate).toBe('');
  });

  it('should not set the expirationDate when adding a blank earnDate for certs', () => {
    subject.setState('skillType', SkillType.Certification);
    subject.setState('earnDate', '');
    expect(subject.state.expirationDate).toBe('');
  });

  it('can remove a skill', () => {
    subject.open(skill);
    subject.removeModel();
    expect(skillActions.setPendingDeleteSkill).toHaveBeenCalledWith(skill);
  });

  it('should render certification options based off the site of the selected airman', () => {
    expect(subject.certificationOptions.length).toBe(3);
  });
});
