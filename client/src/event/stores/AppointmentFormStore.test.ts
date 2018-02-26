import * as moment from 'moment';
import { AppointmentFormStore } from './AppointmentFormStore';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { EventActions } from './EventActions';

describe('AppointmenFormStore', () => {
  const airmanId = 123;
  let eventActions: EventActions;
  let subject: AppointmentFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    subject = new AppointmentFormStore(eventActions);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasEvent).toBeFalsy();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasEvent).toBeTruthy();
      expect(subject.state.title).toBe(event.title);
      expect(subject.state.description).toBe(event.description);
      expect(subject.state.startDate).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.startTime).toBe(event.startTime.format('HHmm'));
      expect(subject.state.endDate).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('HHmm'));
      expect(subject.errors.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasEvent).toBeTruthy();

      subject.close();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasEvent).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState({
      title: 'Title',
      description: 'Description',
      startDate: '2018-02-22',
      startTime: '1200',
      endDate: '2018-02-22',
      endTime: '1300'
    });

    subject.addAppointment(airmanId);

    const expectedEvent = new EventModel(
      'Title',
      'Description',
      moment('2018-02-22 1200', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 1300', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.Appointment
    );

    expect(eventActions.addEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('ensures that at least dates are included in the appointment submission', () => {
    subject.setState({
      title: 'Title',
      description: 'Description',
      startDate: '',
      startTime: '0000',
      endDate: '2018-02-22',
      endTime: '2359'
    });

    subject.addAppointment(airmanId);

    expect((eventActions.addEvent as jest.Mock).mock.calls[0][0].startTime.isValid()).toBeFalsy();
  });

  it('can remove an event', () => {
    subject.open(event);

    subject.removeAppointment();

    expect(eventActions.removeEvent).toHaveBeenCalledWith(event);
  });
});