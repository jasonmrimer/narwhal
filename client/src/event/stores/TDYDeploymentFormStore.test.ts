import * as moment from 'moment';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { TDYDeploymentFormStore } from './TDYDeploymentFormStore';
import { TimeServiceStub } from '../../tracker/services/doubles/TimeServiceStub';

describe('TDYDeploymentFormStore', () => {
  const airmanId = 123;
  let subject: TDYDeploymentFormStore;
  let event: EventModel;

  beforeEach(() => {
    event = EventModelFactory.build();
    subject = new TDYDeploymentFormStore(new TimeServiceStub());
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasModel).toBeFalsy();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors).toEqual({});
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();
      expect(subject.state.title).toBe(event.title);
      expect(subject.state.description).toBe(event.description);
      expect(subject.state.startTime).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.errors).toEqual({});
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();

      subject.close();
      expect(subject.state.title).toBe('');
      expect(subject.state.description).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors).toEqual({});
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add an event', () => {
    subject.setState('title', 'TDYDeployment');
    subject.setState('description', 'Description');
    subject.setState('startTime', '2018-02-22');
    subject.setState('endTime', '2018-02-22');

    const expectedEvent = new EventModel(
      'TDYDeployment',
      'Description',
      moment('2018-02-22 0000', 'YYYY-MM-DD HHmm'),
      moment('2018-02-22 2359', 'YYYY-MM-DD HHmm'),
      airmanId,
      EventType.TDY_DEPLOYMENT
    );

    const addedEvent = subject.addModel(airmanId);
    expect(addedEvent).toEqual(expectedEvent);
  });

  it('ensures that at least dates are included in the TDY/Deployment submission', () => {
    subject.setState('title', 'Title');
    subject.setState('description', 'Description');
    subject.setState('startTime', '');
    subject.setState('endTime', '2018-02-22');

    const addedEvent = subject.addModel(airmanId);

    expect(addedEvent.startTime.isValid()).toBeFalsy();
  });

  it('should auto-populate empty end data field when setting start date', () => {
    subject.setState('startTime', '2018-02-22');
    expect(subject.state.endTime).toEqual('2018-02-22');
  });

  it('should keep the end date when modifying the start date', () => {
    subject.setState('startTime', '2018-02-22');
    subject.setState('endTime', '2018-02-23');
    subject.setState('startTime', '2018-02-25');
    expect(subject.state.endTime).toEqual('2018-02-23');
  });
});