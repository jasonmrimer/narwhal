import { EventModel, EventType } from '../../event/models/EventModel';
import { action, computed, observable } from 'mobx';
import { Moment } from 'moment';
import { Repositories } from '../../utils/Repositories';

export class AvailabilityStore {
  @observable private _shouldShowEventForm: boolean = false;
  @observable private _shouldShowEventTypeSelection: boolean = true;
  @observable private _eventFormType: EventType | string = '';
  @observable private _pendingDeleteEvent: EventModel | null = null;
  @observable private _event: EventModel | null = null;
  @observable private _airmanEvents: EventModel[] = [];
  @observable private _selectedDate: Moment | null = null;

  constructor(
    private repositories: Repositories,
  ) {
  }

  @computed
  get airmanEvents(): EventModel[] {
    return this._airmanEvents;
  }

  @action.bound
  setAirmanEvents(events: EventModel[]) {
    this._airmanEvents = events;
  }

  @action.bound
  async refreshAirmanEvents(airmanId: number, week: Moment[]) {
    this._airmanEvents = await this.repositories.eventRepository
      .findAllByAirmanIdAndWithinPeriod(airmanId, week[0], week[6]);
  }

  @computed
  get selectedDate() {
    return this._selectedDate;
  }

  @action.bound
  setSelectedDate(date: Moment | null = null) {
    this._selectedDate = date;
  }

  @action.bound
  clearSelectedDate() {
    this._selectedDate = null;
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

  @action.bound
  showEventForm(airmanId: number) {
    this.closeEventForm();
    this._shouldShowEventForm = true;
    this._shouldShowEventTypeSelection = true;
    if (this._selectedDate && this._eventFormType !== EventType.Mission) {
      this._event = new EventModel(
        '',
        '',
        this._selectedDate,
        this._selectedDate,
        airmanId,
        EventType[this._eventFormType]
      );
    }
  }

  @action.bound
  setEventFormType(eventType: EventType) {
    this._eventFormType = eventType;
  }

  @action.bound
  openEditEventForm(event: EventModel) {
    this._shouldShowEventForm = true;
    this._shouldShowEventTypeSelection = false;
    this._eventFormType = event.type;
    this._event = event;
  }

  @computed
  get event() {
    return this._event;
  }

  @action.bound
  closeEventForm() {
    this._shouldShowEventForm = false;
    this._shouldShowEventTypeSelection = false;
    this._eventFormType = '';
    this._event = null;
  }

  @action.bound
  async addEvent(event: EventModel) {
    return await this.repositories.eventRepository.save(event);
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

    const deletedEvent = this._pendingDeleteEvent;
    await this.repositories.eventRepository.delete(this._pendingDeleteEvent);
    this._pendingDeleteEvent = null;
    return deletedEvent;
  }
}
