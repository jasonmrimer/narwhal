import { ProfileRepository } from '../../profile/repositories/ProfileRepository';
import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { ProfileListStore } from '../ProfileList';
import { ErrorResponse } from '../../utils/HTTPClient';

export class AdminStore implements ProfileListStore {
  @observable private _profiles: ProfileModel[] = [];
  @observable private _error: ErrorResponse | null = null;

  constructor(private profileRepository: ProfileRepository) {
  }

  @action.bound
  async hydrate() {
    const result = await this.profileRepository.findAll();
    if (result instanceof ErrorResponse) {
      this._error = result;
    } else {
      this._profiles = result;
    }
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
}