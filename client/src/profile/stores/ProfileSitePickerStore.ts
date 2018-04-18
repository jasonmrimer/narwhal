import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../models/ProfileModel';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { Repositories } from '../../utils/Repositories';

export class ProfileSitePickerStore {
  private siteRepository: SiteRepository;
  private profileRepository: ProfileRepository;
  @observable private _profile: ProfileModel | null = null;
  @observable private _sites: SiteModel[];
  @observable private _pendingSite: SiteModel | null = null;

  constructor(repositories: Repositories) {
    this.siteRepository = repositories.siteRepository;
    this.profileRepository = repositories.profileRepository;
  }

  @action.bound
  async hydrate() {
    this._sites = await this.siteRepository.findAll();
    this._profile = await this.profileRepository.findOne();
  }

  @computed
  get profile() {
    return this._profile;
  }

  @action.bound
  async savePendingSite() {
    if (this._profile && this._pendingSite) {
      const profile = Object.assign({}, this._profile, {siteId: this._pendingSite.id});
      this._profile = await this.profileRepository.save(profile);
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