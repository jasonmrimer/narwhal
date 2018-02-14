import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { EventForm } from './EventForm';
import * as moment from 'moment';
import { eventStub } from '../utils/testUtils';
import { DatePicker } from '../widgets/DatePicker';
import { TextInput } from '../widgets/TextInput';
import { TimeInput } from '../widgets/TimeInput';
import { MissionStore } from '../mission/stores/MissionStore';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { EventModel, EventType } from './models/EventModel';
import { RadioButtons } from '../widgets/RadioButtons';
import Mock = jest.Mock;

describe('EventForm', () => {
  const airmanId = 123;
  const startTime = moment.utc('2018-01-01T01:00:00Z');
  const endTime = moment.utc('2018-01-01T11:00:00Z');

  let handleSubmitSpy: Mock;
  let hideEventFormMock: Mock;
  let subject: ReactWrapper;
  let errors: object[];

  beforeEach(() => {
    hideEventFormMock = jest.fn();
    handleSubmitSpy = jest.fn();
    errors = [];
    const missionStore = new MissionStore(new MissionRepositoryStub());
    missionStore.hydrate();

    subject = mount(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        missionStore={missionStore}
        event={null}
        errors={errors}
      />
    );
  });

  it('calls handleSubmit on submission', () => {
    const appointment = EventType.Appointment;
    subject.find(`input[value="${appointment}"]`).simulate('change', {target: {name: 'eventType', value: appointment}});
    subject.find(TextInput).at(0).simulate('change', {target: {name: 'title', value: 'Title'}});
    subject.find(TextInput).at(1).simulate('change', {target: {name: 'description', value: 'Description'}});
    subject.find(DatePicker).at(0).simulate('change', {target: {name: 'startDate', value: '2018-01-10'}});
    subject.find(TimeInput).at(0).simulate('change', {target: {name: 'startTime', value: '00:00'}});
    subject.find(DatePicker).at(1).simulate('change', {target: {name: 'endDate', value: '2018-01-10'}});
    subject.find(TimeInput).at(1).simulate('change', {target: {name: 'endTime', value: '12:34'}});
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
    subject.find('a.back').simulate('click');
    expect(hideEventFormMock).toBeCalled();
  });

  it('populates the form when given an existing Event', () => {
    const dateTime = moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1);
    subject.setProps({event: event});

    expect(subject.find(RadioButtons).prop('value')).toBe(EventType.Leave);
    expect(subject.find(TextInput).at(0).prop('value')).toBe(event.title);
    expect(subject.find(TextInput).at(1).prop('value')).toBe(event.description);
    expect(subject.find(DatePicker).at(0).prop('dateValue')).toEqual('2018-01-10');
    expect(subject.find(TimeInput).at(0).prop('timeValue')).toEqual('00:00');
    expect(subject.find(DatePicker).at(1).prop('dateValue')).toEqual('2018-01-10');
    expect(subject.find(TimeInput).at(1).prop('timeValue')).toEqual('00:00');
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(event);
  });

  it('has the mission type selected by default', () => {
    expect(subject.find(RadioButtons).prop('value')).toBe(EventType.Mission);
  });

  it('populates the form with a selected mission attributes', () => {
    (subject.instance() as EventForm).handleMissionSelect([{value: 'missionId1', label: 'ato1'}]);
    subject.update();

    expect(subject.find(TextInput).at(0).prop('value')).toBe('ato1');
    expect(subject.find(DatePicker).at(0).prop('dateValue')).toEqual(startTime.format('YYYY-MM-DD'));
    expect(subject.find(TimeInput).at(0).prop('timeValue')).toEqual(startTime.format('HH:mm'));
    expect(subject.find(DatePicker).at(1).prop('dateValue')).toEqual(endTime.format('YYYY-MM-DD'));
    expect(subject.find(TimeInput).at(1).prop('timeValue')).toEqual(endTime.format('HH:mm'));
  });

  it('renders a form field validation', () => {
    errors = [{title: 'Field is required'}];
    subject.setProps({errors: errors});
    expect(subject.find('.error-msg').length).toBe(1);
  });

});