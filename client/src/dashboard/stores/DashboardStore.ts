import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { MissionModel } from '../../mission/models/MissionModel';
import { action, computed, observable, toJS } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { FilterOption } from '../../widgets/inputs/FilterOptionModel';
import { Repositories } from '../../utils/Repositories';
import * as moment from 'moment';
import * as Fuse from 'fuse.js';
import { NotificationStore } from '../../widgets/stores/NotificationStore';

export class DashboardStore extends NotificationStore {
  private siteRepository: SiteRepository;
  private missionRepository: MissionRepository;
  @observable private _sites: SiteModel[] = [];
  @observable private _missions: MissionModel[] = [];
  @observable private _selectedSiteId: number | null = null;
  @observable private _platforms: string[] = [];
  @observable private _selectedPlatformOptions: FilterOption[] = [];
  @observable private _atoMissionNumberFilter: string = '';

  constructor(repositories: Repositories) {
    super();
    this.siteRepository = repositories.siteRepository;
    this.missionRepository = repositories.missionRepository;
  }

  async hydrate() {
    const [sites, missions, platforms] = await Promise.all([
      this.siteRepository.findAll(),
      this.missionRepository.findAll(),
      this.missionRepository.findPlatforms(this._selectedSiteId)
    ]);
    this._sites = sites;
    this._missions = missions;
    this._platforms = platforms;
  }

  @computed
  get selectedSiteId() {
    return this._selectedSiteId;
  }

  @computed
  get siteOptions() {
    const allSite = [{label: 'All Sites', value: -1}];
    const realSites = this._sites.map(site => {
      return {value: site.id, label: site.name};
    });

    return allSite.concat(realSites);
  }

  @computed
  get selectedSiteOption() {
    const found = this.siteOptions.find(x => x.value === this._selectedSiteId);
    return found === undefined ? null : found;
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
  async setSelectedSite(id: number | null) {
    await this.setSiteId(id);
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
      this._selectedSiteId !== null ?
        this._missions
          .filter(this.bySite)
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

  private bySite = (msn: MissionModel) => {
    if (
      msn.site === null ||
      msn.site === undefined
    ) {
      return false;
    }
    if (msn.site != null) {
      if (msn.site!.id === this._selectedSiteId) {
        return true;
      }
    }

    if (this._selectedSiteId === -1 || this._selectedSiteId === null) {
      return true;
    }

    return false;
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

    return new Fuse(missions, {keys: ['atoMissionNumber'], threshold: 0.1}).search(this._atoMissionNumberFilter);
  }

  private async setSiteId(id: number | null) {
    this._selectedSiteId = id;
    this._platforms = await this.missionRepository.findPlatforms(
      this._selectedSiteId === -1 ?
        null :
        this._selectedSiteId
    );
  }
}