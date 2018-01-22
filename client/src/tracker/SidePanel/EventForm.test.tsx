import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { EventForm } from './EventForm';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';
import Mock = jest.Mock;

describe('EventForm', () => {
  const airmanId = 123;
  let handleSubmitSpy: Mock;
  let subject: ShallowWrapper;
  let hideEventFormMock: Mock;

  beforeEach(() => {
    hideEventFormMock = jest.fn();
    handleSubmitSpy = jest.fn();
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
      />
    );
  });

  /* tslint:disable:no-empty */
  it('calls handleSubmit on submission', () => {
    subject.find('input').at(0).simulate('change', {target: {name: 'title', value: 'Dentist'}});
    subject.find('input').at(1).simulate('change', {target: {name: 'description', value: 'Gonna get my teeth clean'}});
    subject.find('input').at(2).simulate('change', {target: {name: 'startDate', value: '2018-01-10'}});
    subject.find('input').at(3).simulate('change', {target: {name: 'startTime', value: '00:00'}});
    subject.find('input').at(4).simulate('change', {target: {name: 'endDate', value: '2018-01-10'}});
    subject.find('input').at(5).simulate('change', {target: {name: 'endTime', value: '12:34'}});
    subject.find('form').simulate('submit', {
      preventDefault: () => {
      }
    });

    const expectedEvent = new EventModel(
      'Dentist',
      'Gonna get my teeth clean',
      moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm'),
      moment.utc('2018-01-10 12:34', 'YYYY-MM-DD HH:mm'),
      airmanId
    );
    expect(handleSubmitSpy).toHaveBeenCalledWith(expectedEvent);
  });

  it('calls the hideEventForm when clicking back', () => {
    subject.find('a.back').simulate('click');
    expect(hideEventFormMock).toBeCalled();
  });
});