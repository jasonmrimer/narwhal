import MissionRepository from './repositories/MissionRepository';
import { action, computed, observable } from 'mobx';
import { SiteStore } from '../site/SiteStore';
import { MissionModel } from './models/MissionModel';

export class MissionStore {
  @observable private _missions: MissionModel[] = [];

  constructor(private repository: MissionRepository, private siteStore: SiteStore) {
  }

  @action
  async fetchAllMissions() {
    this._missions = await this.repository.findAll();
  }

  @action.bound
  async fetchBySiteId(id: number) {
    this.siteStore.setSelectedSiteId(id);
    if (id > -1) {
      this._missions = await this.repository.findBySite(id);
    } else {
      this.fetchAllMissions();
    }
  }

  @computed
  get missions() {
    return this._missions;
  }
}