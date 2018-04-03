import { EventModel, EventType } from '../../event/models/EventModel';
import { action, computed, observable } from 'mobx';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { Moment } from 'moment';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventActions } from '../../event/stores/EventActions';
import { Repositories } from '../../Repositories';
import { MissionModel } from '../../mission/models/MissionModel';
import { TDYDeploymentFormStore } from '../../event/stores/TDYDeploymentFormStore';

interface RefreshAirmen {
  refreshAirmen: (item: { airmanId: number }) => Promise<void>;
}

export class AvailabilityStore implements EventActions {
  public appointmentFormStore: AppointmentFormStore;
  public leaveFormStore: LeaveFormStore;
  public missionFormStore: MissionFormStore;
  public tdyDeploymentFormStore: TDYDeploymentFormStore;

  @observable private _shouldShowEventForm: boolean = false;
  @observable private _shouldShowEventTypeSelection: boolean = true;
  @observable private _eventFormType: EventType | string = '';
  @observable private _selectedDate: Moment;
  @observable private _pendingDeleteEvent: EventModel | null = null;
  @observable private _airmanEvents: EventModel[] = [];

  private eventTypeFormStoreMap: object;

  static callFormStoreFunction<T, S>(store: FormStore<T, S>,
                                     method: string,
                                     arg?: EventModel | object[] | null) {
    store[method].call(store, arg);
  }

  constructor(private refreshAirmen: RefreshAirmen, private repositories: Repositories) {
    this.appointmentFormStore = new AppointmentFormStore(this);
    this.leaveFormStore = new LeaveFormStore(this);
    this.missionFormStore = new MissionFormStore(this);
    this.tdyDeploymentFormStore = new TDYDeploymentFormStore(this);
    this.eventTypeFormStoreMap = {
      [EventType.Mission]: this.missionFormStore,
      [EventType.Appointment]: this.appointmentFormStore,
      [EventType.Leave]: this.leaveFormStore,
      [EventType.TDY_DEPLOYMENT]: this.tdyDeploymentFormStore,
    };
  }

  hydrate(missions: MissionModel[]) {
    this.missionFormStore.hydrate(missions);
  }

  @computed
  get airmanEvents(): EventModel[] {
    return this._airmanEvents;
  }

  @action.bound
  setAirmanEvents(events: EventModel[]) {
    this._airmanEvents = events;
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
  get shouldShowEventTypeSelection() {
    return this._shouldShowEventTypeSelection;
  }

  @computed
  get selectedDate() {
    return this._selectedDate;
  }

  @action.bound
  showEventForm(selectedDate?: Moment) {
    this._shouldShowEventTypeSelection = true;
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
    this._shouldShowEventTypeSelection = false;
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

  @action.bound
  async addEvent(event: EventModel) {
    try {
      const addedEvent = await this.repositories.eventRepository.save(event);
      await this.refreshAirmen.refreshAirmen(event);
      this.closeEventForm();
      return addedEvent;
    } catch (e) {
      this.setFormErrors(e);
      return event;
    }
  }

  @action.bound
  removeEvent(event: EventModel) {
    this._pendingDeleteEvent = event;
  }

  @computed
  get pendingDeleteEvent() {
    return this._pendingDeleteEvent;
  }

  @action.bound
  cancelPendingDelete() {
    this._pendingDeleteEvent = null;
  }

  @action.bound
  async executePendingDelete() {
    if (this._pendingDeleteEvent == null) {
      return;
    }
    try {
      await this.repositories.eventRepository.delete(this._pendingDeleteEvent);
      await this.refreshAirmen.refreshAirmen(this._pendingDeleteEvent);
      this.closeEventForm();
    } catch (e) {
      this.setFormErrors(e);
    }
    this._pendingDeleteEvent = null;
  }

  setFormErrors(errors: object[]) {
    AvailabilityStore.callFormStoreFunction(this.eventTypeFormStoreMap[this.eventFormType], 'setErrors', errors);
  }
}
