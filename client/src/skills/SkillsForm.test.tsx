import * as React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { eventStub } from '../utils/testUtils';
import { SkillsForm } from './SkillsForm';
import { QualificationModel } from './models/QualificationModel';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import * as moment from 'moment';
import { DatePicker } from '../widgets/DatePicker';
import { CertificationModel } from './models/CertificationModel';
import { QualificationModelFactory } from './factories/QualificationModelFactory';
import { CertificationModelFactory } from './factories/CertificationModelFactory';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import { SkillType } from './models/SkillType';
import { StyledForm } from '../widgets/Form';
import Mock = jest.Mock;

describe('SkillsForm', () => {
  const earnDate = moment('2018-02-01');
  const expirationDate = moment('2019-02-01');

  let errors: object[] = [];
  let quals: QualificationModel[];
  let certs: CertificationModel[];
  let handleSubmitSpy: Mock;
  let handleDeleteSpy: Mock;
  let subject: ShallowWrapper;
  let mountedSubject: ReactWrapper;

  beforeEach(() => {
    handleSubmitSpy = jest.fn();
    handleDeleteSpy = jest.fn();
    quals = QualificationModelFactory.buildList(3);
    certs = CertificationModelFactory.buildList(3);
    errors = [];

    subject = shallow(
      <SkillsForm
        airmanId={1}
        qualifications={quals}
        certifications={certs}
        skill={null}
        handleSubmit={handleSubmitSpy}
        handleDelete={handleDeleteSpy}
        errors={errors}
      />
    );
  });

  it('calls handleSubmit with a Qualification on submission', () => {
    const skillForm = (subject.instance() as SkillsForm);
    skillForm.handleChange({target: {name: 'skillType', value: SkillType.Qualification}});
    skillForm.handleChange({target: {name: 'skillNameId', value: 1}});
    skillForm.handleChange({target: {name: 'earnDate', value: earnDate}});
    skillForm.handleChange({target: {name: 'expirationDate', value: expirationDate}});

    subject.find(StyledForm).simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(
      new AirmanQualificationModel(
        1,
        quals[1],
        earnDate,
        expirationDate
      ));
  });

  it('calls handleSubmit with a Certification on submission', () => {
    const skillForm = (subject.instance() as SkillsForm);
    skillForm.handleChange({target: {name: 'skillType', value: SkillType.Certification}});
    skillForm.handleChange({target: {name: 'skillNameId', value: 1}});
    skillForm.handleChange({target: {name: 'earnDate', value: earnDate}});
    skillForm.handleChange({target: {name: 'expirationDate', value: expirationDate}});

    subject.find(StyledForm).simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(
      new AirmanCertificationModel(
        1,
        certs[1],
        earnDate,
        expirationDate
      ));
  });

  describe('rendering with an existing skill', () => {
    const skill = AirmanQualificationModelFactory.build(1);

    beforeEach(() => {
      mountedSubject = mount(
        <SkillsForm
          airmanId={1}
          qualifications={quals}
          certifications={certs}
          skill={skill}
          handleSubmit={handleSubmitSpy}
          handleDelete={handleDeleteSpy}
          errors={errors}
        />
      );
    });

    it('should only allow the edit of the expiration date', () => {
      mountedSubject.find('select').forEach((elem) => {
        expect(elem.prop('disabled')).toBeTruthy();
      });

      expect(mountedSubject.find(DatePicker).at(0).prop('disabled')).toBeTruthy();
      expect(mountedSubject.find(DatePicker).at(1).prop('disabled')).toBeFalsy();

      mountedSubject.find('form').simulate('submit', eventStub);

      expect(handleSubmitSpy).toHaveBeenCalled();
      expect(handleSubmitSpy.mock.calls[0][0].id).toBeDefined();
      expect(handleSubmitSpy.mock.calls[0][0].id).toBe(skill.id);
    });

    it('calls handleDelete when clicking the delete button', () => {
      mountedSubject.find('button').simulate('click');
      expect(handleDeleteSpy).toHaveBeenCalledWith(skill);
    });
  });
});