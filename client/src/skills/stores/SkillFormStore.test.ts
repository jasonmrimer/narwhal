import { SkillFormStore } from './SkillFormStore';
import { Skill } from '../models/Skill';
import { SkillType } from '../models/SkillType';
import * as moment from 'moment';
import { CertificationModelFactory } from '../certification/factories/CertificationModelFactory';
import { QualificationModelFactory } from '../qualifications/factories/QualificationModelFactory';

describe('SkillFormStore', () => {
  const airmanId = 123;
  const skill: Skill = {
    id: 1,
    type: SkillType.Qualification,
    airmanId: airmanId,
    skillId: 2,
    earnDate: moment(),
    periodicDue: moment(),
    currencyExpiration: moment(),
    lastSat: moment()
  };

  let subject: SkillFormStore;

  beforeEach(() => {

    const certifications = [
      ...CertificationModelFactory.buildList(3, 1),
      ...CertificationModelFactory.buildList(3, 2)
    ];
    const qualifications = QualificationModelFactory.buildList(3);

    subject = new SkillFormStore();
    subject.hydrate(certifications, qualifications, 1);
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
      expect(subject.state.periodicDue).toBe('');
      expect(subject.state.currencyExpiration).toBe('');
      expect(subject.state.lastSat).toBe('');
      expect(subject.errors).toEqual({});
    });

    it('should set the state with the given skill', () => {
      subject.open(skill);
      expect(subject.hasModel).toBeTruthy();
      expect(subject.state.skillType).toBe(skill.type);
      expect(subject.state.skillId).toBe(String(skill.skillId));
      expect(subject.state.earnDate).toBe(skill.earnDate.format('YYYY-MM-DD'));
      expect(subject.state.periodicDue).toBe(skill.periodicDue.format('YYYY-MM-DD'));
      expect(subject.state.currencyExpiration).toBe(skill.currencyExpiration.format('YYYY-MM-DD'));
      expect(subject.state.lastSat).toBe(skill.lastSat.format('YYYY-MM-DD'));
      expect(subject.errors).toEqual({});
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
      expect(subject.state.periodicDue).toBe('');
      expect(subject.state.currencyExpiration).toBe('');
      expect(subject.state.lastSat).toBe('');
      expect(subject.errors).toEqual({});
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('returns a skill type from the state', () => {
    subject.setState('skillType', skill.type);
    subject.setState('skillId', String(skill.skillId));

    const model = subject.stateToModel(airmanId);
    expect(model.type).toBe(skill.type);
    expect(model.skillId).toBe(skill.skillId);
  });

  it('should set the periodicDue 24 months ahead when adding an earnDate for quals', () => {
    subject.setState('skillType', SkillType.Qualification);
    subject.setState('earnDate', skill.earnDate.format('YYYY-MM-DD'));
    expect(subject.state.periodicDue).toBe(skill.earnDate.clone().startOf('day').add(2, 'y').format('YYYY-MM-DD'));
  });

  it('should set the periodicDue 90 days ahead when adding an earnDate for certs', () => {
    subject.setState('skillType', SkillType.Certification);
    subject.setState('earnDate', skill.earnDate.format('YYYY-MM-DD'));
    expect(subject.state.periodicDue).toBe(skill.earnDate.clone().startOf('day').add(90, 'd').format('YYYY-MM-DD'));
  });

  it('should not set the periodicDue when adding a blank earnDate for quals', () => {
    subject.setState('skillType', SkillType.Qualification);
    subject.setState('earnDate', '');
    expect(subject.state.periodicDue).toBe('');
  });

  it('should not set the periodicDue when adding a blank earnDate for certs', () => {
    subject.setState('skillType', SkillType.Certification);
    subject.setState('earnDate', '');
    expect(subject.state.periodicDue).toBe('');
  });

  it('should render certification options based off the site of the selected airman', () => {
    expect(subject.certificationOptions.length).toBe(3);
  });
});
