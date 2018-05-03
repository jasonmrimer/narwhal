import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { FilterOption } from '../../widgets/models/FilterOptionModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import * as moment from 'moment';
import { FormErrors } from '../../widgets/FieldValidation';

export class AirmanProfileManagerStore {
  @observable _airman: AirmanModel = AirmanModel.empty();
  @observable _sites: SiteModel[] = [];
  @observable _ripItems: AirmanRipItemModel[] = [];
  @observable _schedules: ScheduleModel[] = [];
  @observable _scheduleId: number;
  @observable _loading: boolean = false;
  @observable _errors: FormErrors = {};

  constructor(private airmanRepository: AirmanRepository) {
  }

  hydrate(
    airman: AirmanModel,
    sites: SiteModel[],
    schedules: ScheduleModel[],
    ripItems?: AirmanRipItemModel[],
  ) {
    this._airman = airman;
    this._sites = sites;
    this._ripItems = ripItems ? ripItems : this._ripItems;
    this._schedules = schedules;
    this._scheduleId = airman.currentScheduleId ?
      airman.currentScheduleId :
      this._schedules.find(s => s.type === ScheduleType.NoSchedule)!.id;
    this._errors = {};
  }

  @computed
  get airman() {
    return this._airman;
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get ripItems() {
    return this._ripItems;
  }

  @computed
  get scheduleId() {
    return this._scheduleId;
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action.bound
  setErrors(errors: FormErrors) {
    this._errors = errors;
  }

  @computed
  get siteOptions(): FilterOption[] {
    const siteOptions = this._airman.siteId === -1 ?
      [{value: -1, label: 'No Site Selected'}] :
      [];
    return siteOptions.concat(this._sites.map(site => {
      return {value: site.id, label: site.fullName};
    }));
  }

  @computed
  get squadronOptions(): FilterOption[] {
    const site = this._sites.find(s => s.id === this._airman.siteId);
    if (!site) {
      return [];
    }

    return site.squadrons.map(squadron => {
      return {value: squadron.id, label: squadron.name};
    });
  }

  @computed
  get flightOptions(): FilterOption[] {
    const site = this.getSite(this._airman.siteId);
    if (!site) {
      return [];
    }

    const squadron = this.getSquadron(this._airman.squadronId);
    if (!squadron) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  @computed
  get scheduleOptions() {
    return this._schedules.map(schedule => {
      return {value: schedule.id, label: schedule.type};
    });
  }

  @computed
  get expiredItemCount(): number {
    return this._ripItems
      .filter(item => item.isExpired)
      .length;
  }

  @computed
  get assignedItemCount(): number {
    return this._ripItems
      .filter(item => item.expirationDate != null && item.expirationDate.isValid())
      .length;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setState(key: keyof AirmanModel | 'scheduleId', value: any) {
    switch (key) {
      case 'siteId':
        this.setSquadronAndFlight(Number(value));
        break;
      case 'squadronId':
        this.setFlight(Number(value));
        break;
      case 'scheduleId':
        this._scheduleId = Number(value);
        break;
      default:
        break;
    }

    this._airman[(key as any)] = value;
  }

  @action.bound
  async addAirman() {
    if (this._scheduleId) {
      this.addSchedule();
    }
    this._airman = await this.airmanRepository.saveAirman(this._airman);
  }

  private addSchedule() {
    const schedule = this._schedules.find(s => s.id === this._scheduleId);
    if (schedule) {
      this._airman.schedules.push(new AirmanScheduleModel(this._airman.id, schedule, moment()));
    }
  }

  private setSquadronAndFlight(siteId: number) {
    const site = this.getSite(siteId);
    if (!site || (site && site.squadrons.length < 1)) {
      this._airman.squadronId = -1;
      this._airman.flightId = -1;
      return;
    }

    const squadron = site.squadrons[0];
    if (squadron.flights.length < 1) {
      this._airman.squadronId = squadron.id;
      this._airman.flightId = -1;
      return;
    }

    this._airman.squadronId = squadron.id;
    this._airman.flightId = squadron.flights[0].id;
  }

  private setFlight(squadronId: number) {
    const squadron = this.getSquadron(squadronId);
    if (!squadron || (squadron && squadron.flights.length < 1)) {
      this._airman.flightId = -1;
      return;
    }

    const flight = squadron.flights[0];
    this._airman.flightId = flight.id;
  }

  private getSite(id: number) {
    return this._sites.find(s => s.id === id);
  }

  private getSquadron(id: number) {
    const squadrons = this._sites.map(site => site.squadrons).reduce((acc, val) => acc.concat(val), []);
    return squadrons.find(s => s.id === id);
  }
}