import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel } from '../../airman/models/AirmanModel';

export class SiteManagerStore extends NotificationStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;
  @observable private _airmen: AirmanModel[] = [];

  @action.bound
  hydrate(profile: ProfileModel, squadron: SquadronModel, airmen: AirmanModel[]) {
    this._profile = profile;
    this._squadron = squadron;
    this._airmen = airmen.filter(a => a.squadronId === squadron.id);
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

  getAirmenByFlightId = (flightId: number) => {
    return this._airmen.filter(a => a.flightId === flightId);
  }
}