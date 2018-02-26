import { action, computed, observable } from 'mobx';
import { EventModel, EventType } from '../models/EventModel';
import * as moment from 'moment';
import { EventActions } from './EventActions';

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class AppointmentFormStore {
  @observable private event: EventModel | null = null;
  @observable private _state: State;
  @observable private _errors: object[] = [];

  constructor(private eventActions: EventActions) {
    this._state = {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action.bound
  open(event: EventModel | null = null) {
    this._errors = [];
    this.event = event;
    this._state = {
      title: event ? event.title : '',
      description: event ? event.description : '',
      startDate: event ? event.startTime.format('YYYY-MM-DD') : '',
      startTime: event ? event.startTime.format('HHmm') : '',
      endDate: event ? event.endTime.format('YYYY-MM-DD') : '',
      endTime: event ? event.endTime.format('HHmm') : '',
    };
  }

  @action.bound
  close() {
    this._errors = [];
    this.event = null;
    this._state = {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @computed
  get state() {
    return this._state;
  }

  @action.bound
  setState(state: Partial<State>) {
    this._state = Object.assign({}, this._state, state);
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action.bound
  setErrors(errors: object[]) {
    this._errors = errors;
  }

  @computed
  get hasEvent() {
    return this.event != null;
  }

  addAppointment(airmanId: number) {
    const event = new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Appointment,
      this.event ? this.event.id : null
    );
    this.eventActions.addEvent(event);
  }

  removeAppointment() {
    if (this.event != null) {
      this.eventActions.removeEvent(this.event);
    }
  }

  private makeMoment(date: string, time: string) {
    if (date === '') {
      return moment.invalid();
    }
    return moment(`${date} ${time}`, 'YYYY-MM-DD HHmm');
  }
}