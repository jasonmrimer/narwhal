import { action, computed, observable } from 'mobx';
import { FilterableStore } from '../stores/FilterableStore';
import SiteModel from './models/SiteModel';
import SiteRepository from './repositories/SiteRepository';

export class SiteStore implements FilterableStore {
  @observable private _selectedSiteId: number = -1;
  @observable private _sites: SiteModel[] = [];

  constructor(private repository: SiteRepository) {
  }

  @action
  async fetchAllSites() {
    this._sites = await this.repository.findAll();
  }

  @action
  setSelectedSiteId(id: number) {
    this._selectedSiteId = id;
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get currentOptionId() {
    return this._selectedSiteId;
  }

  @computed
  get options() {
    return this._sites.map((site: SiteModel) => {
      return {value: site.id, label: site.name};
    });
  }

  get isDisabled() {
    return false;
  }
}