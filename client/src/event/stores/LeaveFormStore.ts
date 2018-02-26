import { action, computed, observable } from 'mobx';
import { EventModel, EventType } from '../models/EventModel';
import { EventActions } from './EventActions';
import * as moment from 'moment';

interface State {
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class LeaveFormStore {
  @observable private event: EventModel | null = null;
  @observable private _state: State;
  @observable private _errors: object[] = [];

  constructor(private eventActions: EventActions) {
    this._state = {
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
      description: event ? event.description : '',
      startDate: event ? event.startTime.format('YYYY-MM-DD') : '',
      startTime: event ? event.startTime.format('HHmm') : '0000',
      endDate: event ? event.endTime.format('YYYY-MM-DD') : '',
      endTime: event ? event.endTime.format('HHmm') : '2359',
    };
  }

  @action.bound
  close() {
    this._errors = [];
    this.event = null;
    this._state = {
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

  addLeave(airmanId: number) {
    const event = new EventModel(
      'Leave',
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Leave,
      this.event ? this.event.id : null
    );
    this.eventActions.addEvent(event);
  }

  removeLeave() {
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