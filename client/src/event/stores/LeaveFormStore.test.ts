import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { LeaveFormStore } from './LeaveFormStore';
import * as moment from 'moment';
import { TimeServiceStub } from '../../tracker/services/doubles/TimeServiceStub';

describe('LeaveFormStore', () => {
  const airmanId = 123;
  let subject: LeaveFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    subject = new LeaveFormStore(new TimeServiceStub());
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasModel).toBeFalsy();
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('0000');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('2359');
      expect(subject.errors).toEqual({});
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();
      expect(subject.state.description).toBe(event.description);
      expect(subject.state.startDate).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.startTime).toBe(event.startTime.format('HHmm'));
      expect(subject.state.endDate).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('HHmm'));
      expect(subject.errors).toEqual({});
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();

      subject.close();
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('0000');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('2359');
      expect(subject.errors).toEqual({});
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState('description', 'Description');
    subject.setState('startDate', '2018-02-22');
    subject.setState('startTime', '0000');
    subject.setState('endDate', '2018-02-22');
    subject.setState('endTime', '2359');

    const expectedEvent = new EventModel(
      'Leave',
      'Description',
      moment('2018-02-22 0000', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 2359', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.Leave
    );

    expect(subject.addModel(airmanId)).toEqual(expectedEvent);
  });

  it('ensures that at least dates are included in the leave submission', () => {
    subject.setState('description', 'Description');
    subject.setState('endDate', '2018-02-22');
    subject.setState('endTime', '2359');

    const addedEvent = subject.addModel(airmanId);

    expect(addedEvent.startTime.isValid()).toBeFalsy();
  });

  it('should auto-populate empty end data field when setting start date', () => {
    subject.setState('startDate', '2018-02-22');
    expect(subject.state.endDate).toEqual('2018-02-22');
  });

  it('should keep the end date when modifying the start date', () => {
    subject.setState('startDate', '2018-02-22');
    subject.setState('endDate', '2018-02-23');
    subject.setState('startDate', '2018-02-25');
    expect(subject.state.endDate).toEqual('2018-02-23');
  });
});