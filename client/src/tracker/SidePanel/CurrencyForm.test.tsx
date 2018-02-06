import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { eventStub, eventTargetStub } from '../../utils/testUtils';
import { CurrencyForm } from './CurrencyForm';
import QualificationModel from '../../skills/models/QualificationModel';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import * as moment from 'moment';
import { Moment } from 'moment';
import DatePicker from '../../widgets/DatePicker';
import CertificationModel from '../../skills/models/CertificationModel';
import QualificationModelFactory from '../../skills/factories/QualificationModelFactory';
import CertificationModelFactory from '../../skills/factories/CertificationModelFactory';
import AirmanCertificationModel from '../../airman/models/AirmanCertificationModel';
import AirmanQualificationModelFactory from '../../airman/factories/AirmanQualificationModelFactory';
import Mock = jest.Mock;
import { SkillType } from '../../skills/models/SkillType';

describe('CurrencyForm', () => {
  const earnDate = moment.utc('2018-02-01');
  const expirationDate = moment.utc('2019-02-01');

  let quals: QualificationModel[];
  let certs: CertificationModel[];
  let handleSubmitSpy: Mock;
  let subject: ReactWrapper;

  beforeEach(() => {
    handleSubmitSpy = jest.fn();
    quals = QualificationModelFactory.buildList(3);
    certs = CertificationModelFactory.buildList(3);

    subject = mount(
      <CurrencyForm
        airmanId={1}
        qualifications={quals}
        certifications={certs}
        skill={null}
        handleSubmit={handleSubmitSpy}
      />
    );
  });

  it('calls handleSubmit with a Qualification on submission', () => {
    selectValueFromDropdown(subject, 'skillType', SkillType.Qualification);
    selectValueFromDropdown(subject, 'skillNameId', '1');
    inputValueForDatePicker(subject.find(DatePicker).at(0), 'earnDate', earnDate);
    inputValueForDatePicker(subject.find(DatePicker).at(1), 'expirationDate', expirationDate);
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(
      new AirmanQualificationModel(
        1,
        quals[1],
        earnDate,
        expirationDate
      ));
  });

  it('calls handleSubmit with a Certification on submission', () => {
    selectValueFromDropdown(subject, 'skillType', SkillType.Certification);
    selectValueFromDropdown(subject, 'skillNameId', '1');
    inputValueForDatePicker(subject.find(DatePicker).at(0), 'earnDate', earnDate);
    inputValueForDatePicker(subject.find(DatePicker).at(1), 'expirationDate', expirationDate);
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(
      new AirmanCertificationModel(
        1,
        certs[1],
        earnDate,
        expirationDate
      ));
  });

  it('should only allow the edit of the expiration date', () => {
    const skill = AirmanQualificationModelFactory.build(1);

    subject = mount(
      <CurrencyForm
        airmanId={1}
        qualifications={quals}
        certifications={certs}
        skill={skill}
        handleSubmit={handleSubmitSpy}
      />
    );

    subject.find('select').forEach((elem) => {
      expect(elem.prop('disabled')).toBeTruthy();
    });

    expect(subject.find(DatePicker).at(0).prop('disabled')).toBeTruthy();
    expect(subject.find(DatePicker).at(1).prop('disabled')).toBeFalsy();

    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(handleSubmitSpy.mock.calls[0][0].id).toBeDefined();
    expect(handleSubmitSpy.mock.calls[0][0].id).toBe(skill.id);
  });
});

/* tslint:disable:no-any */
function selectValueFromDropdown(wrapper: any, name: string, value: any) {
  wrapper.find(`select[name="${name}"]`).simulate('change', eventTargetStub(name, value));
}

function inputValueForDatePicker(wrapper: any, name: string, value: Moment) {
  wrapper.find(`input[name="${name}"]`).simulate('change', eventTargetStub(name, value.format('YYYY-MM-DD')));

}