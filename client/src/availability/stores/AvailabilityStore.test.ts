import { AvailabilityStore } from './AvailabilityStore';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { EventActions } from '../../event/stores/EventActions';
import { EventModel, EventType } from '../../event/models/EventModel';
import { EventModelFactory } from '../../event/factories/EventModelFactory';
import { MissionFormStore } from '../../event/stores/MissionFormStore';

describe('AvailabilityStore', () => {
  let eventActions: EventActions;
  let subject: AvailabilityStore;

  beforeEach(() => {
    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };
    subject = new AvailabilityStore(
      new AppointmentFormStore(eventActions),
      new LeaveFormStore(eventActions),
      new MissionFormStore(eventActions)
    );
  });

  it('should show the event form without an event', () => {
    expect(subject.hasEvent).toBeFalsy();
    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');

    subject.showEventForm();

    expect(subject.hasEvent).toBeFalsy();
    expect(subject.shouldShowEventForm).toBeTruthy();
    expect(subject.eventFormType).toBe('');
  });

  describe('should open an event form for create', () => {
    beforeEach(() => {
      expect(subject.hasEvent).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe('');
    });

    it('opens leave', () => {
      subject.openCreateEventForm(EventType.Leave);

      expect(subject.hasEvent).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Leave);
    });

    it('opens appointment', () => {
      subject.openCreateEventForm(EventType.Appointment);

      expect(subject.hasEvent).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Appointment);
    });

    it('opens mission', () => {
      subject.openCreateEventForm(EventType.Mission);

      expect(subject.hasEvent).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Mission);
    });
  });

  describe('should open an event form for edit', () => {
    let event: EventModel;

    beforeEach(() => {
      expect(subject.hasEvent).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe('');
      event = EventModelFactory.build();
    });

    it('edit leave', () => {
      event.type = EventType.Leave;
      subject.openEditEventForm(event);

      expect(subject.hasEvent).toBeTruthy();
      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });

    it('edit appointment', () => {
      event.type = EventType.Appointment;
      subject.openEditEventForm(event);

      expect(subject.hasEvent).toBeTruthy();
      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });

    it('edit mission', () => {
      event.type = EventType.Mission;
      subject.openEditEventForm(event);

      expect(subject.hasEvent).toBeTruthy();
      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });
  });

  it('should close the event form', () => {
    const event = EventModelFactory.build();
    subject.openEditEventForm(event);

    subject.closeEventForm();

    expect(subject.hasEvent).toBeFalsy();
    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');
  });
});