import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';
import { Moment } from 'moment';
import { FlightRepository } from '../../flight/repositories/FlightRepository';
import { FlightModel } from '../../flight/model/FlightModel';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { Repositories } from '../../utils/Repositories';

export class SiteManagerStore extends NotificationStore {
  private flightRepository: FlightRepository;
  private siteRepository: SiteRepository;
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
  @observable private _pendingNewFlight: FlightModel | null = null;
  @observable private _flightsExpanded: number[] = [];
  @observable private _pendingFlightShift: boolean = false;
  constructor(repositories: Repositories) {
    super();
    this.flightRepository = repositories.flightRepository;
    this.siteRepository = repositories.siteRepository;
  }

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
  get expandedFlights () {
    return this._flightsExpanded;
  }

  @observable
  shouldExpandFlight(flightId: number) {
    return this._flightsExpanded.find(x => x === flightId) !== undefined;
  }

  @observable
  shouldAllowFlightDelete(flightId: number) {
    return this.getAirmenByFlightId(flightId).length === 0;
  }

  @action.bound
  addFlightToExpandedFlights(flightId: number) {
    if (!this.shouldExpandFlight(flightId)) {
      this._flightsExpanded.push(flightId);
    }
  }

  @action.bound
  removeFlightFromExpandedFlights(flightId: number) {
      this._flightsExpanded = this._flightsExpanded.filter(x => x !== flightId);
  }

  @computed
  get pendingFlightShift() {
    return this._pendingFlightShift;
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
  setPendingFlightName(name: string) {
    if (this._pendingNewFlight) {
      this._pendingNewFlight.name = name;
    }
  }

  @action.bound
  addPendingNewFlight() {
    this._pendingNewFlight = FlightModel.empty();
    this._pendingNewFlight.squadronId = this._squadron.id;
  }

  @action.bound
  cancelPendingNewFlight() {
    this._pendingNewFlight = null;
  }

  @action.bound
  async savePendingNewFlight() {
    if (this._pendingNewFlight) {
      await this.flightRepository.save(this._pendingNewFlight);
      this._pendingNewFlight = null;
    }
  }

  @action.bound
  async deleteFlight(flightId: number) {
    await this.flightRepository.delete(flightId);
  }

  @action.bound
  async refreshFlights() {
    const site = await this.siteRepository.findOne(this._profile!.siteId!);

    if (site) {
      const squadronId = this._profile!.squadronId ? this._profile!.squadronId : this._squadron.id;
      const squad = site.squadrons.find((squadron: SquadronModel) => squadron.id === squadronId);
      this._squadron = squad ? squad : this._squadron;
    }
  }
}