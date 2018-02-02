import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { eventStub } from '../../utils/testUtils';
import { CurrencyForm } from './CurrencyForm';
import QualificationModel from '../../skills/models/QualificationModel';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import * as moment from 'moment';
import DatePicker from '../../widgets/DatePicker';
import Mock = jest.Mock;

describe('CurrencyForm', () => {
  let quals: QualificationModel[];
  let createAirmanQualificationSpy: Mock;
  let subject: ReactWrapper;

  beforeEach(() => {
    createAirmanQualificationSpy = jest.fn();
    quals = [
      new QualificationModel(1, '1', '1'),
      new QualificationModel(2, '2', '2'),
      new QualificationModel(3, '3', '3')
    ];
    subject = mount(
      <CurrencyForm
        airmanId={1}
        qualifications={quals}
        createAirmanQualification={createAirmanQualificationSpy}
      />
    );
  });

  it('calls handleSubmit on submission', () => {
    subject.find('select[name="qualificationIndex"]').simulate('change', {
      target: {
        name: 'qualificationIndex',
        value: '1'
      }
    });
    subject.find(DatePicker).at(0).find('input[name="earnDate"]').simulate('change', {
      target: {
        name: 'earnDate',
        value: '2018-02-01'
      }
    });
    subject.find(DatePicker).at(1).find('input[name="expirationDate"]').simulate('change', {
      target: {
        name: 'expirationDate',
        value: '2019-02-01'
      }
    });
    subject.find('form').simulate('submit', eventStub);
    expect(createAirmanQualificationSpy).toHaveBeenCalledWith(
      new AirmanQualificationModel(
        1,
        quals[1],
        moment.utc('2018-02-01'),
        moment.utc('2019-02-01')
      ));
  });
});
