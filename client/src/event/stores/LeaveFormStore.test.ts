import { EventActions } from './EventActions';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { LeaveFormStore } from './LeaveFormStore';
import * as moment from 'moment';

describe('LeaveFormStore', () => {
  const airmanId = 123;
  let eventActions: EventActions;
  let subject: LeaveFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    subject = new LeaveFormStore(eventActions);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasItem).toBeFalsy();
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('0000');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('2359');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasItem).toBeTruthy();
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
      expect(subject.hasItem).toBeTruthy();

      subject.close();
      expect(subject.state.description).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('0000');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('2359');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasItem).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState({
      description: 'Description',
      startDate: '2018-02-22',
      startTime: '0000',
      endDate: '2018-02-22',
      endTime: '2359'
    });

    subject.addItem(airmanId);

    const expectedEvent = new EventModel(
      'Leave',
      'Description',
      moment('2018-02-22 0000', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 2359', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.Leave
    );

    expect(eventActions.addEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('ensures that at least dates are included in the leave submission', () => {
    subject.setState({
      description: 'Description',
      startDate: '',
      startTime: '0000',
      endDate: '2018-02-22',
      endTime: '2359'
    });

    subject.addItem(airmanId);

    expect((eventActions.addEvent as jest.Mock).mock.calls[0][0].startTime.isValid()).toBeFalsy();
  });

  it('can remove an event', () => {
    subject.open(event);

    subject.removeItem();

    expect(eventActions.removeEvent).toHaveBeenCalledWith(event);
  });
});