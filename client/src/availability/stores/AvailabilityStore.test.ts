import { AvailabilityStore } from './AvailabilityStore';
import { EventModel, EventType } from '../../event/models/EventModel';
import { EventModelFactory } from '../../event/factories/EventModelFactory';
import * as moment from 'moment';
import { DoubleRepositories } from '../../utils/Repositories';
import { FakeEventRepository } from '../../event/repositories/doubles/FakeEventRepository';

describe('AvailabilityStore', () => {
  let eventRepository: FakeEventRepository;
  let subject: AvailabilityStore;

  beforeEach(() => {
    subject = new AvailabilityStore(DoubleRepositories);
    eventRepository = (DoubleRepositories.eventRepository as FakeEventRepository);
  });

  it('should show the event form without an event', () => {
    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');

    subject.showEventForm(1);

    expect(subject.shouldShowEventForm).toBeTruthy();
    expect(subject.eventFormType).toBe('');
  });

  describe('should open an event form for create', () => {
    beforeEach(() => {
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe('');
    });

    it('opens leave', () => {
      subject.setEventFormType(EventType.Leave);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Leave);
    });

    it('opens appointment', () => {
      subject.setEventFormType(EventType.Appointment);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Appointment);
    });

    it('opens mission', () => {
      subject.setEventFormType(EventType.Mission);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Mission);
    });

    it('should render the StyledRadioButtons for event types', () => {
      expect(subject.shouldShowEventTypeSelection).toBeTruthy();
    });
  });

  describe('should open an event form for edit', () => {
    let event: EventModel;

    beforeEach(() => {
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe('');
      event = EventModelFactory.build();
    });

    it('edit leave', () => {
      event.type = EventType.Leave;
      subject.openEditEventForm(event);

      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });

    it('edit appointment', () => {
      event.type = EventType.Appointment;
      subject.openEditEventForm(event);

      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });

    it('edit mission', () => {
      event.type = EventType.Mission;
      subject.openEditEventForm(event);

      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.eventFormType).toBe(event.type);
    });

    it('should not render the StyledRadioButtons for event types', () => {
      event.id = 1;
      event.type = EventType.Leave;
      subject.openEditEventForm(event);

      expect(subject.shouldShowEventForm).toBeTruthy();
      expect(subject.shouldShowEventTypeSelection).toBeFalsy();
    });

  });

  it('should close the event form', () => {
    const event = EventModelFactory.build();
    subject.openEditEventForm(event);

    subject.closeEventForm();

    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');
  });

  describe('deleting events', () => {
    let savedEvent: EventModel;

    beforeEach(async () => {
      savedEvent = await subject.addEvent(EventModelFactory.build());
      expect(subject.pendingDeleteEvent).toBeNull();
      subject.removeEvent(savedEvent);
    });

    it('should set pending delete event', () => {
      expect(subject.pendingDeleteEvent).toEqual(savedEvent);
    });

    it('should cancel pending delete event', () => {
      subject.cancelPendingDelete();
      expect(subject.pendingDeleteEvent).toBeNull();
    });

    it('should delete an airman\'s event', async () => {
      await subject.executePendingDelete();
      expect(subject.pendingDeleteEvent).toBeNull();
      expect(eventRepository.hasItem(savedEvent)).toBeFalsy();
      expect(subject.shouldShowEventForm).toBeFalsy();
    });
  });

  describe('creating and editing events', () => {
    const event = new EventModel('Title', 'Description', moment(), moment(), 1, EventType.Mission);

    it('should add an event to an airman', async () => {
      const savedEvent = await subject.addEvent(event);
      expect(eventRepository.hasItem(savedEvent)).toBeTruthy();
    });

    it('should edit an existing event on an airman', async () => {
      const savedEvent = await subject.addEvent(event);
      const eventCount = eventRepository.count;

      savedEvent.title = 'Changed Title';
      const updatedEvent = await subject.addEvent(savedEvent);

      expect(eventRepository.count).toBe(eventCount);
      expect(eventRepository.hasItem(updatedEvent)).toBeTruthy();
    });
  });
});