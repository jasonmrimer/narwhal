import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { EventForm } from './EventForm';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import { eventStub } from '../../utils/testUtils';
import DatePicker from '../../widgets/DatePicker';
import TextInput from '../../widgets/TextInput';
import RadioButtons from '../../widgets/RadioButtons';
import FieldValidation from '../../widgets/FieldValidation';
import TimeInput from '../../widgets/TimeInput';
import { MissionModel } from '../../mission/models/MissionModel';
import Mock = jest.Mock;

describe('EventForm', () => {
  const airmanId = 123;
  const startTime = moment.utc();
  const endTime = moment.utc();

  let handleSubmitSpy: Mock;
  let hideEventFormMock: Mock;
  let subject: ShallowWrapper;

  beforeEach(() => {
    hideEventFormMock = jest.fn();
    handleSubmitSpy = jest.fn();
    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        hideEventForm={hideEventFormMock}
        missions={[new MissionModel('mission1', 'mission1', startTime, endTime)]}
        missionOptions={[{value: 'mission1', label: 'mission1'}]}
        event={null}
      />
    );
  });

  it('calls handleSubmit on submission', () => {
    subject.find(RadioButtons).simulate('change', {target: {name: 'eventType', value: EventType.Appointment}});
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

  it('populates the form with a selected mission attributes', () => {
    (subject.instance() as EventForm).handleMissionSelect({value: 'mission1', label: 'mission1 label'});
    subject.update();

    expect(subject.find(TextInput).at(0).prop('value')).toBe('mission1');
    expect(subject.find(DatePicker).at(0).prop('dateValue')).toEqual(startTime.format('YYYY-MM-DD'));
    expect(subject.find(TimeInput).at(0).prop('timeValue')).toEqual(startTime.format('HH:mm'));
    expect(subject.find(DatePicker).at(1).prop('dateValue')).toEqual(endTime.format('YYYY-MM-DD'));
    expect(subject.find(TimeInput).at(1).prop('timeValue')).toEqual(endTime.format('HH:mm'));
  });

  it('renders a form field validation', () => {
    const dateTime = moment.utc('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const errors = [{title: 'Field is required'}];
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1, errors);
    subject.setProps({event: event});

    expect(subject.find(FieldValidation).length).toBe(3);
  });
});