import { action, computed, observable } from 'mobx';
import { EventModel, EventType } from '../models/EventModel';
import * as moment from 'moment';
import { EventActions } from './EventActions';
import { MissionModel } from '../../mission/models/MissionModel';

interface State {
  missionId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class MissionFormStore {
  @observable private event: EventModel | null = null;
  @observable private _state: State;
  @observable private _errors: object[] = [];

  constructor(private eventActions: EventActions) {
    this._state = {
      missionId: '',
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
      missionId: event ? event.title : '',
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
      missionId: '',
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
  setState(mission: MissionModel | null) {
    if (mission == null) {
      this._state = {
        missionId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      };
    } else {
      this._state = {
        missionId: mission.missionId,
        startDate: mission.startDateTime.format('YYYY-MM-DD'),
        startTime: mission.startDateTime.format('HHmm'),
        endDate: mission.endDateTime ? mission.endDateTime.format('YYYY-MM-DD') : '',
        endTime: mission.endDateTime ? mission.endDateTime.format('HHmm') : ''
      };
    }
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

  addMission(airmanId: number) {
    const event = new EventModel(
      this._state.missionId,
      '',
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Mission,
      this.event ? this.event.id : null
    );
    this.eventActions.addEvent(event);
  }

  removeMission() {
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