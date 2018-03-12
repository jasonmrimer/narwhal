import { action, computed, observable } from 'mobx';
import { ProfileModel, UserModel } from '../models/ProfileModel';
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
  setUser(user: UserModel) {
    this._profile = Object.assign({}, this._profile, {user: user});
  }

  @action.bound
  async save() {
    this._profile = await this.profileRepository.save(this._profile!.user);
  }

  siteByName (name: string) {
    return this._sites.find(s => s.name === name)!;
  }
}