import { AvailabilityStore } from './AvailabilityStore';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { EventActions } from '../../event/stores/EventActions';
import { EventModel, EventType } from '../../event/models/EventModel';
import { EventModelFactory } from '../../event/factories/EventModelFactory';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { MissionStore } from '../../mission/stores/MissionStore';
import { toJS } from 'mobx';
import * as moment from 'moment';

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
      new MissionFormStore(eventActions, new MissionStore(new MissionRepositoryStub()))
    );
  });

  it('should show the event form without an event', () => {
    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');

    subject.showEventForm();

    expect(subject.shouldShowEventForm).toBeTruthy();
    expect(subject.eventFormType).toBe('');
  });

  describe('should open an event form for create', () => {
    beforeEach(() => {
      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe('');
    });

    it('should open an event form with a selectedDate', () => {
      const openAppointmentSpy = jest.fn();
      subject.appointmentFormStore.open = openAppointmentSpy;

      subject.showEventForm(moment('2017-11-26'));
      const event = new EventModel('', '', subject.selectedDate, subject.selectedDate, 1, EventType.Appointment);

      subject.openCreateEventForm(EventType.Appointment, 1);
      expect(openAppointmentSpy).toHaveBeenCalledWith(event);
    });

    it('should not include the selectedDate when opens a new Mission Form', () => {
      const openMissionSpy = jest.fn();
      subject.missionFormStore.open = openMissionSpy;

      subject.showEventForm(moment('2017-11-26'));

      subject.openCreateEventForm(EventType.Mission, 1);
      expect(openMissionSpy).toHaveBeenCalledWith(null);
    });

    it('opens leave', () => {
      subject.openCreateEventForm(EventType.Leave, 1);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Leave);
    });

    it('opens appointment', () => {
      subject.openCreateEventForm(EventType.Appointment, 1);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Appointment);
    });

    it('opens mission', () => {
      subject.openCreateEventForm(EventType.Mission, 1);

      expect(subject.shouldShowEventForm).toBeFalsy();
      expect(subject.eventFormType).toBe(EventType.Mission);
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
  });

  it('should close the event form', () => {
    const event = EventModelFactory.build();
    subject.openEditEventForm(event);

    subject.closeEventForm();

    expect(subject.shouldShowEventForm).toBeFalsy();
    expect(subject.eventFormType).toBe('');
  });

  it('should set errors on children stores when it calls setFormErrors', () => {
    subject.openCreateEventForm(EventType.Appointment, 1);
    subject.setFormErrors([{title: 'This field is required.'}]);
    expect(toJS(subject.appointmentFormStore.errors)).toEqual([{title: 'This field is required.'}]);
  });
});