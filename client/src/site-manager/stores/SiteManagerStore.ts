import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';

export class SiteManagerStore extends NotificationStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _certifications: CertificationModel[] = [];
  @observable private _schedules: ScheduleModel[] = [];

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

  @action.bound
  setAirmenShiftByFlightId(flightId: number, shift: ShiftType) {
    this._airmen
      .filter(airman => airman.flightId === flightId)
      .forEach(airman => airman.shift = shift);
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
}