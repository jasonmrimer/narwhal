import { action, computed, observable } from 'mobx';
import { AdminSquadronModel } from '../models/AdminSquadronModel';

export class AdminSquadronStore {
  @observable private _squadrons: AdminSquadronModel[] = [];

  @action.bound
  hydrate(squadrons: AdminSquadronModel[]) {
    this._squadrons = squadrons;
  }

  @computed
  get squadrons() {
    return this._squadrons;
  }

  @computed
  get hasData() {
    return this._squadrons.length !== 0;
  }
}