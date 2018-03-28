import * as moment from 'moment';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { EventActions } from './EventActions';
import { TDYDeploymentFormStore } from './TDYDeploymentFormStore';

describe('TDYDeploymentFormStore', () => {
  const airmanId = 123;
  let eventActions: EventActions;
  let subject: TDYDeploymentFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    subject = new TDYDeploymentFormStore(eventActions);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasItem).toBeFalsy();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasItem).toBeTruthy();
      expect(subject.state.title).toBe(event.title);
      expect(subject.state.description).toBe(event.description);
      expect(subject.state.startTime).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.errors.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasItem).toBeTruthy();

      subject.close();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasItem).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState({
      title: 'TDYDeployment',
      description: 'Description',
      startTime: '2018-02-22',
      endTime: '2018-02-22',
    });

    subject.addItem(airmanId);

    const expectedEvent = new EventModel(
      'TDYDeployment',
      'Description',
      moment('2018-02-22 0000', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 2359', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.TDY_DEPLOYMENT
    );

    expect(eventActions.addEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('ensures that at least dates are included in the TDY/Deployment submission', () => {
    subject.setState({
      title: 'Title',
      description: 'Description',
      startTime: '',
      endTime: '2018-02-22',
    });

    subject.addItem(airmanId);

    expect((eventActions.addEvent as jest.Mock).mock.calls[0][0].startTime.isValid()).toBeFalsy();
  });

  it('can remove an event', () => {
    subject.open(event);

    subject.removeItem();

    expect(eventActions.removeEvent).toHaveBeenCalledWith(event);
  });

  it('should auto-populate empty end data field when setting start date', () => {
    subject.setState({startTime: '2018-02-22'});
    expect(subject.state.endTime).toEqual('2018-02-22');
  });

  it('should keep the end date when modifying the start date', () => {
    subject.setState({startTime: '2018-02-22', endTime: '2018-02-23'});
    subject.setState({startTime: '2018-02-25'});
    expect(subject.state.endTime).toEqual('2018-02-23');
  });
});