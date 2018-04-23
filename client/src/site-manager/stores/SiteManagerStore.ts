import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { Repositories } from '../../utils/Repositories';
import { ProfileRepository } from '../../profile/repositories/ProfileRepository';
import { ProfileModel } from '../../profile/models/ProfileModel';

export class SiteManagerStore{
  @observable private _profile: ProfileModel | null = null;
  @observable private _airmen: AirmanModel[] = [];

  private airmenRepository: AirmanRepository;
  private profileRepository: ProfileRepository;

  constructor(repositories: Repositories) {
    this.profileRepository = repositories.profileRepository;
    this.airmenRepository = repositories.airmanRepository;
  }

  @action.bound
  async hydrate() {
   this._profile = await this.profileRepository.findOne();
   this._airmen = await this.airmenRepository.findBySiteId(this._profile.siteId!);
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get siteName() {
    if (this._profile) {
      return this._profile!.siteName;
    }
    return '';
  }
}