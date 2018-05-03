import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { MissionModel } from '../../mission/models/MissionModel';
import { action, computed, observable, toJS } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { FilterOption, UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { Repositories } from '../../utils/Repositories';
import * as moment from 'moment';
import * as Fuse from 'fuse.js';

export class DashboardStore {
  private siteRepository: SiteRepository;
  private missionRepository: MissionRepository;
  @observable private _sites: SiteModel[] = [];
  @observable private _missions: MissionModel[] = [];
  @observable private _siteId: number = UnfilteredValue;
  @observable private _loading: boolean = false;
  @observable private _platforms: string[] = [];
  @observable private _selectedPlatformOptions: FilterOption[] = [];
  @observable private _atoMissionNumberFilter: string = '';

  constructor(repositories: Repositories) {
    this.siteRepository = repositories.siteRepository;
    this.missionRepository = repositories.missionRepository;
  }

  async hydrate() {
    this._loading = true;

    const [sites, missions, platforms] = await Promise.all([
      this.siteRepository.findAll(),
      this.missionRepository.findAll(),
      this.missionRepository.findPlatforms(this._siteId)
    ]);
    this._sites = sites;
    this._missions = missions;
    this._platforms = platforms;

    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
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

  @computed
  get platformOptions() {
    return this._platforms.map((obj: string, index: number) => {
      return {label: obj, value: index};
    });
  }

  @action.bound
  setSelectedPlatformOptions(selectedOptions: FilterOption[]) {
    this._selectedPlatformOptions = selectedOptions;
  }

  @computed
  get selectedPlatformOptions() {
    return toJS(this._selectedPlatformOptions);
  }

  @action.bound
  async setSiteId(id: number) {
    this._siteId = id;
    this._platforms = await this.missionRepository.findPlatforms(this._siteId);
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

    let filteredMissions =
      this._siteId !== UnfilteredValue ?
        this._missions
          .filter(msn => msn.site != null)
          .filter(msn => msn.site!.id === this._siteId)
          .filter(this.byPlatforms) :
        this._missions
          .filter(this.byPlatforms);

    filteredMissions = this.filterByAtoMissionNumber(filteredMissions);
    return filteredMissions.reduce(
      (accum, current) => {
        intervals.forEach(interval => {
          if (current.startDateTime.isBetween(interval.startTime, interval.endTime, 'minute', '[)')) {
            (accum[interval.label] = accum[interval.label] || []).push(current);
          }
        });
        return accum;
      },
      {}
    );
  }

  @action.bound
  handleFilterMission(value: string) {
    this._atoMissionNumberFilter = value;
  }

  @computed
  get atoMissionNumberFilter() {
    return this._atoMissionNumberFilter;
  }

  private byPlatforms = (mission: MissionModel) => {
    if (this._selectedPlatformOptions.length === 0) {
      return true;
    } else {
      return this._selectedPlatformOptions
        .map(opt => opt.label)
        .some((label: string) => mission.platform.includes(label));
    }
  }

  private filterByAtoMissionNumber(missions: MissionModel[]): any {
    if (this._atoMissionNumberFilter === '') {
      return missions;
    }

    return new Fuse(missions, {keys: ['atoMissionNumber'], threshold: 0.1,}).search(this._atoMissionNumberFilter);
  }
}