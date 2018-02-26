import { EventModel, EventType } from '../../event/models/EventModel';
import { action, computed, observable } from 'mobx';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';

export class AvailabilityStore {
  @observable private _shouldShowEventForm: boolean = false;
  @observable private _eventFormType: EventType | string = '';

  constructor(public appointmentFormStore: AppointmentFormStore,
              public leaveFormStore: LeaveFormStore,
              public missionFormStore: MissionFormStore) {
  }

  @computed
  get eventFormType() {
    return this._eventFormType;
  }

  @computed
  get hasEvent() {
    switch (this._eventFormType) {
      case EventType.Appointment:
        return this.appointmentFormStore.hasEvent;
      case EventType.Leave:
        return this.leaveFormStore.hasEvent;
      case EventType.Mission:
        return this.missionFormStore.hasEvent;
      default:
        return false;
    }
  }

  @computed
  get shouldShowEventForm() {
    return this._shouldShowEventForm;
  }

  @action.bound
  showEventForm() {
    this._shouldShowEventForm = true;
  }

  @action.bound
  openCreateEventForm(eventType: EventType) {
    this._eventFormType = eventType;
    switch (eventType) {
      case EventType.Appointment:
        return this.appointmentFormStore.open();
      case EventType.Leave:
        return this.leaveFormStore.open();
      case EventType.Mission:
        return this.missionFormStore.open();
      default:
        return;
    }
  }

  @action.bound
  openEditEventForm(event: EventModel) {
    this._shouldShowEventForm = true;
    this._eventFormType = event.type;
    switch (event.type) {
      case EventType.Appointment:
        return this.appointmentFormStore.open(event);
      case EventType.Leave:
        return this.leaveFormStore.open(event);
      case EventType.Mission:
        return this.missionFormStore.open(event);
      default:
        return;
    }
  }

  @action.bound
  closeEventForm() {
    switch (this._eventFormType) {
      case EventType.Appointment:
        this.appointmentFormStore.close();
        break;
      case EventType.Leave:
        this.leaveFormStore.close();
        break;
      case EventType.Mission:
        this.missionFormStore.close();
        break;
      default:
        break;
    }
    this._shouldShowEventForm = false;
    this._eventFormType = '';
  }

  setFormErrors(errors: object[]) {
    switch (this._eventFormType) {
      case EventType.Appointment:
        return this.appointmentFormStore.setErrors(errors);
      case EventType.Leave:
        return this.leaveFormStore.setErrors(errors);
      case EventType.Mission:
        return this.missionFormStore.setErrors(errors);
      default:
        return;
    }
  }
}
