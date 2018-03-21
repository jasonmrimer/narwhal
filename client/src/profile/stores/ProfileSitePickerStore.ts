import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../models/ProfileModel';
import ProfileRepository from '../repositories/ProfileRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { SiteModel } from '../../site/models/SiteModel';

export class ProfileSitePickerStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _sites: SiteModel[];

  constructor(
    private profileRepository: ProfileRepository,
    private siteRepository: SiteRepository) {}

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
  async saveSiteId(siteId: number) {
    if (this._profile) {
      const user = Object.assign({}, this._profile.user, {siteId: siteId});
      this._profile = await this.profileRepository.save(user);
    }
  }

  getSiteByName (name: string) {
    return this._sites.find(s => s.name === name)!;
  }
}