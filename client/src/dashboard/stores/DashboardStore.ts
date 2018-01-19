import MissionRepository from '../../mission/repositories/MissionRepository';
import SiteRepository from '../../site/repositories/SiteRepository';
import { MissionModel } from '../../mission/models/MissionModel';
import { action, computed, observable } from 'mobx';
import SiteModel from '../../site/models/SiteModel';

export default class DashboardStore {
  private missionRepository: MissionRepository;
  private siteRepository: SiteRepository;

  @observable private _missions: MissionModel[] = [];
  @observable private _sites: SiteModel[] = [];

  @observable private _siteId: number = -1;

  constructor(missionRepository: MissionRepository, siteRepository: SiteRepository) {
    this.missionRepository = missionRepository;
    this.siteRepository = siteRepository;
  }

  async hydrate() {
    this._missions = await this.missionRepository.findAll();
    this._sites = await this.siteRepository.findAll();
  }

  @computed
  get missions() {
    if (this._siteId === -1) {
      return this._missions;
    }
    return this._missions
      .filter(msn => msn.site != null)
      .filter(msn => msn.site!.id === this._siteId);
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
}