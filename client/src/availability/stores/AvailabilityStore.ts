import EventModel from '../../event/models/EventModel';
import { action, computed, observable } from 'mobx';

export default class AvailabilityStore {
  @observable private _showEventForm: boolean = false;
  @observable private _selectedEvent: EventModel | null = null;
  @observable private _pendingDeleteEvent: EventModel | null = null;

  @computed
  get selectedEvent() {
    return this._selectedEvent;
  }

  @action.bound
  setSelectedEvent(event: EventModel) {
    this._selectedEvent = event;
  }

  @action.bound
  clearSelectedEvent() {
    this._selectedEvent = null;
  }

  @computed
  get showEventForm() {
    return this._showEventForm;
  }

  @action.bound
  setShowEventForm(showEventForm: boolean) {
    this._showEventForm = showEventForm;
  }

  @action.bound
  setPendingDeleteEvent(event: EventModel | null = null) {
    this._pendingDeleteEvent = event;
  }

  @computed
  get pendingDeleteEvent() {
    return this._pendingDeleteEvent;
  }
}