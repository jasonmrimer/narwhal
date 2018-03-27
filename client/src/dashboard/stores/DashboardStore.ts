import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { MissionModel } from '../../mission/models/MissionModel';
import { action, computed, observable } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { Repositories } from '../../Repositories';
import * as moment from 'moment';

export class DashboardStore {
  private siteRepository: SiteRepository;
  private missionRepository: MissionRepository;

  @observable private _sites: SiteModel[] = [];
  @observable private _missions: MissionModel[] = [];

  @observable private _siteId: number = UnfilteredValue;

  constructor(repositories: Repositories) {
    this.siteRepository = repositories.siteRepository;
    this.missionRepository = repositories.missionRepository;
  }

  async hydrate() {
    const results = await Promise.all([
      this.siteRepository.findAll(),
      this.missionRepository.findAll()
    ]);

    this._sites = results[0];
    this._missions = results[1];
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @computed
  get siteOptions() {
    return this._sites.map(site => {
      return {value: site.id, label: site.name};
    });
  }

  @action.bound
  setSiteId(id: number) {
    this._siteId = id;
  }

  @computed
  get missions() {
    const intervals = [
      {label: 'NEXT 24 HOURS', startTime: moment(), endTime: moment().add(24, 'hour')},
      {label: 'NEXT 72 HOURS', startTime: moment().add(24, 'hour'), endTime: moment().add(24 * 3, 'hour')},
      {label: 'THIS WEEK', startTime: moment().add(24 * 3, 'hour'), endTime: moment().add(24 * 7, 'hour')},
      {label: 'NEXT WEEK', startTime: moment().add(24 * 7, 'hour'), endTime: moment().add(24 * 14, 'hour')},
      {label: 'LONG RANGE', startTime: moment().add(24 * 14, 'hour'), endTime: moment().add(24 * 30, 'hour')},
    ];

    const filteredMissions =
      this._siteId !== UnfilteredValue ?
        this._missions
          .filter(msn => msn.site != null)
          .filter(msn => msn.site!.id === this._siteId) :
        this._missions;

    return filteredMissions.reduce((accum, current) => {
      intervals.forEach(interval => {
        current.startDateTime.isBetween(interval.startTime, interval.endTime, 'minute', '[)') ?
          (accum[interval.label] = accum[interval.label] || []).push(current) : accum;
      });
      return accum;
    }, {});
  }
}