import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { EventForm } from './EventForm';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import { eventStub } from '../../utils/testUtils';
import Mock = jest.Mock;

describe('EventForm', () => {
  const airmanId = 123;
  let handleSubmitSpy: Mock;
  let subject: ShallowWrapper;
  let hideEventFormMock: Mock;

  beforeEach(() => {
    hideEventFormMock = jest.fn();
    handleSubmitSpy = jest.fn();
  });

  /* tslint:disable:no-empty */
  it('calls handleSubmit on submission', () => {
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        event={null}
      />
    );

    subject.find('input[value="APPOINTMENT"]').simulate('change', {target: {name: 'eventType', value: 'APPOINTMENT'}});
    findInputByName(subject, 'title').simulate('change', {target: {name: 'title', value: 'Title'}});
    findInputByName(subject, 'description').simulate('change', {target: {name: 'description', value: 'Description'}});
    findInputByName(subject, 'startDate').simulate('change', {target: {name: 'startDate', value: '2018-01-10'}});
    findInputByName(subject, 'startTime').simulate('change', {target: {name: 'startTime', value: '00:00'}});
    findInputByName(subject, 'endDate').simulate('change', {target: {name: 'endDate', value: '2018-01-10'}});
    findInputByName(subject, 'endTime').simulate('change', {target: {name: 'endTime', value: '12:34'}});
    subject.find('form').simulate('submit', eventStub);

    const expectedEvent = new EventModel(
      'Title',
      'Description',
      moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm'),
      moment.utc('2018-01-10 12:34', 'YYYY-MM-DD HH:mm'),
      airmanId,
      EventType.Appointment
    );
    expect(handleSubmitSpy).toHaveBeenCalledWith(expectedEvent);
  });

  it('calls the hideEventForm when clicking back', () => {
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        event={null}
      />
    );
    subject.find('a.back').simulate('click');
    expect(hideEventFormMock).toBeCalled();
  });

  it('populates the form when given an existing Event', () => {
    const dateTime = moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1);
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        event={event}
      />
    );

    expect(subject.find('input[value="LEAVE"]').prop('checked')).toBeTruthy();
    expect(subject.find('input[value="APPOINTMENT"]').prop('checked')).toBeFalsy();
    expect(subject.find('input[value="MISSION"]').prop('checked')).toBeFalsy();
    expect(findInputByName(subject, 'title').prop('value')).toEqual(event.title);
    expect(findInputByName(subject, 'description').prop('value')).toEqual(event.description);
    expect(findInputByName(subject, 'startDate').prop('value')).toEqual('2018-01-10');
    expect(findInputByName(subject, 'startTime').prop('value')).toEqual('00:00');
    expect(findInputByName(subject, 'endDate').prop('value')).toEqual('2018-01-10');
    expect(findInputByName(subject, 'endTime').prop('value')).toEqual('00:00');
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(event);
  });

  it('renders a form with validation errors', () => {
    const dateTime = moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const errors = [{title: 'Field is required'}];
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1, errors);
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        event={event}
      />
    );

    expect(subject.text()).toContain('This field is required.');
  });
});

function findInputByName(wrapper: ShallowWrapper, name: string) {
  return wrapper.find(`input[name="${name}"]`);
}