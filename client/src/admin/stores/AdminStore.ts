import { ProfileRepository } from '../../profile/repositories/ProfileRepository';
import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { ErrorResponse } from '../../utils/HTTPClient';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { Repositories } from '../../utils/Repositories';

export class AdminStore extends NotificationStore {
  @observable private _profiles: ProfileModel[] = [];
  @observable private _error: ErrorResponse | null = null;
  @observable private _roles: { id: number; name: string }[] = [];
  private profileRepository: ProfileRepository;

  constructor(repositories: Repositories) {
    super();
    this.profileRepository = repositories.profileRepository;
  }

  @action.bound
  hydrate(profilesResp: ProfileModel[] | ErrorResponse, rolesResp: any) {
    this.setLoading(true);

    if (profilesResp instanceof ErrorResponse) {
      this._error = profilesResp;
    } else {
      this._profiles = profilesResp;
      this._roles = rolesResp;
    }
    this.setLoading(false);
  }

  @computed
  get profiles() {
    return this._profiles;
  }

  @computed
  get hasError() {
    return this._error !== undefined && this._error !== null;
  }

  @computed
  get error() {
    return this._error;
  }

  @computed
  get roleOptions() {
    return this._roles.map(role => {
      return {value: role.id, label: role.name};
    });
  }

  @action.bound
  async setProfileRole(profile: ProfileModel, roleId: number) {
    const updatedProfile = await this.profileRepository.save(Object.assign({}, profile, {roleId}));
    const index = this._profiles.findIndex(p => p.id === profile.id);
    this._profiles.splice(index, 1, updatedProfile);
  }
}