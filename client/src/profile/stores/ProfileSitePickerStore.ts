import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../models/ProfileModel';
import ProfileRepository from '../repositories/ProfileRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { SiteModel } from '../../site/models/SiteModel';
import { Repositories } from '../../Repositories';

export class ProfileSitePickerStore {
  private siteRepository: SiteRepository;
  private profileRepository: ProfileRepository;
  @observable private _profile: ProfileModel | null = null;
  @observable private _sites: SiteModel[];

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
  async saveSiteId(siteId: number) {
    if (this._profile) {
      const user = Object.assign({}, this._profile.user, {siteId: siteId});
      this._profile = await this.profileRepository.save(user);
    }
  }

  getSiteByName(name: string) {
    return this._sites.find(s => s.name === name)!;
  }
}