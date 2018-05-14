import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';

export class SiteManagerStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;

  @action.bound
  hydrate(profile: ProfileModel, squadron: SquadronModel) {
    this._profile = profile;
    this._squadron = squadron;
  }

  @computed
  get siteName() {
    if (this._profile) {
      return this._profile!.siteName;
    }
    return '';
  }

  @computed
  get squadron() {
    return this._squadron;
  }
}
