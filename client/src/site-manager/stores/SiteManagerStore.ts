import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';
import { Moment } from 'moment';

export class SiteManagerStore extends NotificationStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _certifications: CertificationModel[] = [];
  @observable private _schedules: ScheduleModel[] = [];
  @observable private _shouldShowSchedulePrompt: boolean = false;
  @observable private _shouldShowAddFlightPrompt: boolean = false;
  @observable private _pendingFlightId: number | null = null;
  @observable private _pendingScheduleId: number | null = null;
  @observable private _pendingScheduleStartDate: any = moment(moment.now());
  @observable private _pendingNewFlight: boolean = false;

  @action.bound
  hydrate(profile: ProfileModel,
          squadron: SquadronModel,
          airmen: AirmanModel[],
          certifications: CertificationModel[],
          schedules: ScheduleModel[]
  ) {
    this._profile = profile;
    this._squadron = squadron;
    this._airmen = airmen.filter(a => a.squadronId === squadron.id);
    this._certifications = certifications;
    this._schedules = schedules;
  }

  @computed
  get shouldShowSchedulePrompt() {
    return this._shouldShowSchedulePrompt;
  }

  @computed
  get shouldShowAddFlightPrompt() {
    return this._shouldShowAddFlightPrompt;
  }

  @computed
  get siteName() {
    if (this._profile) {
      return this._profile!.siteName;
    }
    return '';
  }

  @computed
  get squadron() {
    return this._squadron;
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get pendingFlightId() {
    return this._pendingFlightId;
  }

  @computed
  get pendingScheduleId() {
    return this._pendingScheduleId;
  }

  @computed
  get pendingScheduleStartDate() {
    return this._pendingScheduleStartDate;
  }

  @computed
  get pendingNewFlight() {
    return this._pendingNewFlight;
  }

  @action.bound
  hideSchedulePrompt() {
    this._shouldShowSchedulePrompt = false;
    this._pendingFlightId = null;
    this._pendingScheduleId = null;
    this._pendingScheduleStartDate = moment(moment.now());
  }

  @action.bound
  hideAddFlightPrompt() {
    this._shouldShowAddFlightPrompt = false;
  }

  @action.bound
  setAirmenShiftByFlightId(flightId: number, shift: ShiftType) {
    this._airmen
      .filter(airman => airman.flightId === flightId)
      .forEach(airman => airman.shift = shift);
  }

  @action.bound
  setSchedulePrompt(flightId: number, scheduleId: number) {
    this._shouldShowSchedulePrompt = true;
    this._pendingFlightId = flightId;
    this._pendingScheduleId = scheduleId;
  }

  @computed
  get scheduleOptions() {
    return this._schedules.map(schedule => {
      return {value: schedule.id, label: schedule.type};
    });
  }

  getAirmenByFlightId = (flightId: number) => {
    return this.airmen.filter(a => a.flightId === flightId);
  }

  getShiftByFlightId = (flightId: number) => {
    const object = this.getAirmenByFlightId(flightId).reduce(
      (prev: any, curr: AirmanModel) => {
        if (!curr.shift) {
          return prev;
        }

        const type = curr.shift;
        prev[type] = prev[type] ? prev[type] += 1 : 1;
        return prev;
      },
      {}
    );
    if (Object.keys(object).length === 0) {
      return ShiftType.Day;
    }

    return Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b) as ShiftType;
  }

  getScheduleIdByFlightId = (flightId: number) => {
    const object = this.getAirmenByFlightId(flightId).reduce(
      (prev: any, curr: AirmanModel) => {
        if (!curr.currentAirmanSchedule) {
          return prev;
        }

        const type = curr.currentAirmanSchedule.schedule.id;
        prev[type] = prev[type] ? prev[type] + 1 : 1;
        return prev;
      },
      {}
    );

    if (Object.keys(object).length === 0) {
      return -1;
    }

    return Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b);
  }

  getScheduleByScheduleId = (scheduleId: number) => {
   return this._schedules.find(schedule => schedule.id === scheduleId);
  }

  @action.bound
  setAirmenScheduleByFlightId(flightId: number, airmen: AirmanModel[]) {
    airmen.forEach(updatedAirman => {
      this._airmen = this._airmen.map(airman => {
        if (airman.id === updatedAirman.id) {
          return updatedAirman;
        } else {
          return airman;
        }
      });
    });
  }

  @action.bound
  setPendingScheduleStartDate(input: Moment) {
    this._pendingScheduleStartDate = moment(input);
  }

  @action.bound
  setAddNewFlightPrompt() {
    this._shouldShowAddFlightPrompt = true;
  }

  @action.bound
  addFlight() {
    this._pendingNewFlight = true;
  }

  @action.bound
  cancelAddFlight() {
    this._pendingNewFlight = false;
  }

  @action.bound

}