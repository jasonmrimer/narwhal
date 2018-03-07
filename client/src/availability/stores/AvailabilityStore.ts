import { EventModel, EventType } from '../../event/models/EventModel';
import { action, computed, observable } from 'mobx';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { Moment } from 'moment';
import { FormStore } from '../../widgets/stores/FormStore';

export class AvailabilityStore {
  @observable private _shouldShowEventForm: boolean = false;
  @observable private _eventFormType: EventType | string = '';
  @observable private _selectedDate: Moment;
  private eventTypeFormStoreMap: object;

  static callFormStoreFunction<T, S>(store: FormStore<T, S>,
                                     method: string,
                                     arg?: EventModel | object[] | null) {
    store[method].call(store, arg);
  }

  constructor(public appointmentFormStore: AppointmentFormStore,
              public leaveFormStore: LeaveFormStore,
              public missionFormStore: MissionFormStore) {
    this.eventTypeFormStoreMap = {
      [EventType.Mission]: this.missionFormStore,
      [EventType.Appointment]: this.appointmentFormStore,
      [EventType.Leave]: this.leaveFormStore,
    };
  }

  @computed
  get eventFormType() {
    return this._eventFormType;
  }

  @computed
  get shouldShowEventForm() {
    return this._shouldShowEventForm;
  }

  @computed
  get selectedDate() {
    return this._selectedDate;
  }

  @action.bound
  showEventForm(selectedDate?: Moment) {
    if (selectedDate) {
      this._selectedDate = this._selectedDate = selectedDate;
    }
    this._shouldShowEventForm = true;
  }

  @action.bound
  openCreateEventForm(eventType: EventType, airmanId: number) {
    this._eventFormType = eventType;

    const event = this._selectedDate && eventType !== EventType.Mission ?
      new EventModel('', '', this._selectedDate, this._selectedDate, airmanId, eventType)
      : null;

    AvailabilityStore.callFormStoreFunction(this.eventTypeFormStoreMap[eventType], 'open', event);
  }

  @action.bound
  openEditEventForm(event: EventModel) {
    this._shouldShowEventForm = true;
    this._eventFormType = event.type;
    AvailabilityStore.callFormStoreFunction(this.eventTypeFormStoreMap[event.type], 'open', event);
  }

  @action.bound
  closeEventForm() {
    if (this.eventFormType.length > 0) {
      AvailabilityStore.callFormStoreFunction(this.eventTypeFormStoreMap[this.eventFormType], 'close');
    }
    this._shouldShowEventForm = false;
    this._eventFormType = '';
  }

  setFormErrors(errors: object[]) {
    AvailabilityStore.callFormStoreFunction(this.eventTypeFormStoreMap[this.eventFormType], 'setErrors', errors);
  }
}
