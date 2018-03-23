import * as React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { eventStub } from '../utils/testUtils';
import { SkillsForm } from './SkillsForm';
import * as moment from 'moment';
import { DatePicker } from '../widgets/DatePicker';
import { SkillType } from './models/SkillType';
import { StyledForm } from '../widgets/Form';
import { SkillFormStore } from './stores/SkillFormStore';
import { StyledButton } from '../widgets/Button';
import { SkillActions } from './stores/SkillActions';
import Mock = jest.Mock;

describe('SkillsForm', () => {
  let skillActions: SkillActions;
  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;

  const earnDate = moment('2018-02-01');
  const expirationDate = moment('2019-02-01');

  beforeEach(() => {
    skillActions = {
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      siteId: 1
    };

    const store = new SkillFormStore(skillActions);
    subject = shallow(<SkillsForm airmanId={1} skillFormStore={store}/>);
  });

  it('calls handleSubmit with a Qualification on submission', () => {
    const skillForm = (subject.instance() as SkillsForm);
    skillForm.handleChange({target: {name: 'skillType', value: SkillType.Qualification}});
    skillForm.handleChange({target: {name: 'skillId', value: 1}});
    skillForm.handleChange({target: {name: 'earnDate', value: earnDate}});
    skillForm.handleChange({target: {name: 'expirationDate', value: expirationDate}});

    subject.find(StyledForm).simulate('submit', eventStub);

    expect(skillActions.addSkill).toHaveBeenCalledWith({
      id: null,
      type: SkillType.Qualification,
      airmanId: 1,
      skillId: 1,
      earnDate: earnDate,
      expirationDate: expirationDate
    });
  });

  it('calls handleSubmit with a Certification on submission', () => {
    const skillForm = (subject.instance() as SkillsForm);
    skillForm.handleChange({target: {name: 'skillType', value: SkillType.Certification}});
    skillForm.handleChange({target: {name: 'skillId', value: 1}});
    skillForm.handleChange({target: {name: 'earnDate', value: earnDate}});
    skillForm.handleChange({target: {name: 'expirationDate', value: expirationDate}});

    subject.find(StyledForm).simulate('submit', eventStub);

    expect(skillActions.addSkill).toHaveBeenCalledWith({
      id: null,
      type: SkillType.Certification,
      airmanId: 1,
      skillId: 1,
      earnDate: earnDate,
      expirationDate: expirationDate
    });
  });

  describe('rendering with an existing skill', () => {
    const skill = {
      id: 12345,
      type: SkillType.Certification,
      airmanId: 1,
      skillId: 123,
      earnDate: earnDate,
      expirationDate: expirationDate
    };

    beforeEach(() => {
      skillActions = {
        addSkill: jest.fn(),
        removeSkill: jest.fn(),
        siteId: 1
      };

      const store = new SkillFormStore(skillActions);
      store.open(skill);

      mountedSubject = mount(<SkillsForm airmanId={1} skillFormStore={store}/>);
    });

    it('should only allow the edit of the expiration date', () => {
      mountedSubject.find('select').forEach((elem) => {
        expect(elem.prop('disabled')).toBeTruthy();
      });

      expect(mountedSubject.find(DatePicker).at(0).prop('disabled')).toBeTruthy();
      expect(mountedSubject.find(DatePicker).at(1).prop('disabled')).toBeFalsy();

      mountedSubject.find('form').simulate('submit', eventStub);

      expect(skillActions.addSkill).toHaveBeenCalled();
      expect((skillActions.addSkill as Mock).mock.calls[0][0].id).toBeDefined();
      expect((skillActions.addSkill as Mock).mock.calls[0][0].id).toBe(skill.id);
    });

    it('calls handleDelete when clicking the delete button', () => {
      mountedSubject.find(StyledButton).simulate('click');
      expect(skillActions.removeSkill).toHaveBeenCalledWith(skill);
    });
  });
});