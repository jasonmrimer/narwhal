import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { MissionModel } from '../../mission/models/MissionModel';
import { action, computed, observable } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';

export class DashboardStore {
  private siteRepository: SiteRepository;
  private missionRepository: MissionRepository;

  @observable private _sites: SiteModel[] = [];
  @observable private _missions: MissionModel[] = [];

  @observable private _siteId: number = UnfilteredValue;

  constructor(siteRepository: SiteRepository, missionRepository: MissionRepository) {
    this.siteRepository = siteRepository;
    this.missionRepository = missionRepository;
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
  get missions() {
    if (this._siteId === UnfilteredValue) {
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