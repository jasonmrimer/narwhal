import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../models/ProfileModel';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { Repositories } from '../../utils/Repositories';

export class ProfileSitePickerStore {
  private profileRepository: ProfileRepository;
  @observable private _profile: ProfileModel | null = null;
  @observable private _sites: SiteModel[];
  @observable private _pendingSite: SiteModel | null = null;

  constructor(repositories: Repositories) {
    this.profileRepository = repositories.profileRepository;
  }

  @action.bound
  hydrate(sites: SiteModel[], profile: ProfileModel) {
    this._sites = sites;
    this._profile = profile;
  }

  @computed
  get profile() {
    return this._profile;
  }

  @action.bound
  async savePendingSite() {
    if (this._profile && this._pendingSite) {
      this._profile = await this.profileRepository.updateSite(this._pendingSite.id);
    }
  }

  @computed
  get pendingSite() {
    return this._pendingSite;
  }

  @action.bound
  setPendingSite(site: SiteModel) {
    this._pendingSite = site;
  }

  @action.bound
  cancelPendingSite() {
    this._pendingSite = null;
  }

  @computed
  get dgsCoreSites() {
    return this._sites.filter(site => site.siteType === SiteType.DGSCoreSite);
  }

  @computed
  get dmsSites() {
    return this._sites.filter(site => site.siteType === SiteType.DMSSite);
  }

  @computed
  get guardSites() {
    return this._sites.filter(site => site.siteType === SiteType.GuardSite);
  }

  getSiteByName(name: string) {
    return this._sites.find(s => s.name === name)!;
  }
}