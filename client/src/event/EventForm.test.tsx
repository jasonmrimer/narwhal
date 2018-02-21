import * as React from 'react';
import * as moment from 'moment';
import { EventForm } from './EventForm';
import { eventStub } from '../utils/testUtils';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledTimeInput } from '../widgets/TimeInput';
import { MissionStore } from '../mission/stores/MissionStore';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { EventModel, EventType } from './models/EventModel';
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledDeleteButton } from '../widgets/DeleteButton';
import { shallow, ShallowWrapper } from 'enzyme';
import Mock = jest.Mock;

describe('EventForm', () => {
  const setPendingDeleteSpy = jest.fn();
  const airmanId = 123;
  const startTime = moment('2018-01-01T01:00:00Z');
  const endTime = moment('2018-01-01T11:00:00Z');

  let handleSubmitSpy: Mock;
  let hideEventFormMock: Mock;
  let subject: ShallowWrapper;
  let errors: object[];

  beforeEach(() => {
    hideEventFormMock = jest.fn();
    handleSubmitSpy = jest.fn();
    errors = [];
    const missionStore = new MissionStore(new MissionRepositoryStub());
    missionStore.hydrate();

    subject = shallow(
      <EventForm
        airmanId={airmanId}
        handleSubmit={handleSubmitSpy}
        setPendingDelete={setPendingDeleteSpy}
        hideEventForm={hideEventFormMock}
        missionStore={missionStore}
        event={null}
        errors={errors}
      />
    );
  });

  it('calls handleSubmit on submission', () => {
    const eventForm = (subject.instance() as EventForm);
    const expectedEvent = new EventModel(
      'Title',
      'Description',
      moment('2018-01-10 00:00', 'YYYY-MM-DD HH:mm'),
      moment('2018-01-10 12:34', 'YYYY-MM-DD HH:mm'),
      airmanId,
      EventType.Appointment
    );

    eventForm.handleChange({target: {name: 'eventType', value: expectedEvent.type}});
    eventForm.handleChange({target: {name: 'title', value: expectedEvent.title}});
    eventForm.handleChange({target: {name: 'description', value: expectedEvent.description}});
    eventForm.handleChange({target: {name: 'startDate', value: expectedEvent.startTime.format('YYYY-MM-DD')}});
    eventForm.handleChange({target: {name: 'startTime', value: expectedEvent.startTime.format('HH:mm')}});
    eventForm.handleChange({target: {name: 'endDate', value: expectedEvent.endTime.format('YYYY-MM-DD')}});
    eventForm.handleChange({target: {name: 'endTime', value: expectedEvent.endTime.format('HH:mm')}});
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(expectedEvent);
  });

  it('calls the hideEventForm when clicking back', () => {
    subject.find('a.back').simulate('click');
    expect(hideEventFormMock).toBeCalled();
  });

  it('populates the form when given an existing Event', () => {
    const dateTime = moment('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1);
    subject.setProps({event: event});

    expect(subject.find(StyledRadioButtons).prop('value')).toBe(EventType.Leave);
    expect(subject.find(StyledTextInput).at(0).prop('value')).toBe(event.title);
    expect(subject.find(StyledTextInput).at(1).prop('value')).toBe(event.description);
    expect(subject.find(StyledDatePicker).at(0).prop('dateValue')).toEqual('2018-01-10');
    expect(subject.find(StyledTimeInput).at(0).prop('timeValue')).toEqual('00:00');
    expect(subject.find(StyledDatePicker).at(1).prop('dateValue')).toEqual('2018-01-10');
    expect(subject.find(StyledTimeInput).at(1).prop('timeValue')).toEqual('00:00');
    subject.find('form').simulate('submit', eventStub);

    expect(handleSubmitSpy).toHaveBeenCalledWith(event);
  });

  it('populates the form with a selected mission attributes', () => {
    (subject.instance() as EventForm).handleMissionSelect([{value: 'missionId1', label: 'ato1'}]);
    subject.update();

    expect(subject.find(StyledDatePicker).at(0).prop('dateValue')).toEqual(startTime.format('YYYY-MM-DD'));
    expect(subject.find(StyledDatePicker).at(0).prop('disabled')).toBeTruthy();

    expect(subject.find(StyledTimeInput).at(0).prop('timeValue')).toEqual(startTime.format('HH:mm'));
    expect(subject.find(StyledTimeInput).at(0).prop('disabled')).toBeTruthy();

    expect(subject.find(StyledDatePicker).at(1).prop('dateValue')).toEqual(endTime.format('YYYY-MM-DD'));
    expect(subject.find(StyledDatePicker).at(1).prop('disabled')).toBeTruthy();

    expect(subject.find(StyledTimeInput).at(1).prop('timeValue')).toEqual(endTime.format('HH:mm'));
    expect(subject.find(StyledTimeInput).at(1).prop('disabled')).toBeTruthy();
  });

  it('renders a form field validation', () => {
    errors = [{startTime: 'Field is required'}];
    subject.setProps({errors: errors});

    subject.find(StyledFieldValidation).forEach(fieldValidation => {
      expect(fieldValidation.prop('errors')).toBe(errors);
    });
  });

  it('has an actionable delete button', () => {
    const dateTime = moment('2018-01-10 00:00', 'YYYY-MM-DD HH:mm');
    const event = new EventModel('Title', 'Description', dateTime, dateTime, airmanId, EventType.Leave, 1);
    subject.setProps({event: event});

    const handleDelete = (subject.instance() as EventForm).handleDelete;

    expect(subject.find(StyledDeleteButton).prop('handleClick')).toEqual(handleDelete);

    handleDelete({
      preventDefault: () => {
        return;
      }
    } as React.MouseEvent<HTMLButtonElement>);

    expect(setPendingDeleteSpy).toHaveBeenCalledWith(event);
  });
});
