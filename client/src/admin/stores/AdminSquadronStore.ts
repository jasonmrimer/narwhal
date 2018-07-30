import { action, computed, observable } from 'mobx';
import { AdminSquadronModel } from '../models/AdminSquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AdminSiteModel } from '../models/AdminSiteModel';

export class AdminSquadronStore extends NotificationStore {
  @observable private _pendingDeleteSquadron: AdminSquadronModel | null = null;
  @observable private _pendingSquadron: AdminSquadronModel | null = null;
  @observable private _sites: AdminSiteModel[] = [];
  @observable private _squadrons: AdminSquadronModel[] = [];

  @action.bound
  hydrate(squadrons: AdminSquadronModel[]) {
    this._squadrons = squadrons;
  }

  @action.bound
  defaultPendingSquadron() {
    this._pendingSquadron = null;
  }

  @action.bound
  deleteSquadron(id: number) {
    const index = this._squadrons.findIndex(s => s.squadronId === id);
    this._squadrons.splice(index, 1);
  }

  @action.bound
  setPendingDeleteSquadron(squadron: AdminSquadronModel | null) {
    this._pendingDeleteSquadron = squadron;
  }

  @action.bound
  setPendingSquadron(squadron: AdminSquadronModel) {
    this._pendingSquadron = squadron;
  }

  @action.bound
  setSites(sites: AdminSiteModel[]) {
    this._sites = sites;
  }

  @action.bound
  showDelete(squadron: AdminSquadronModel) {
    return squadron.airmenCount === 0;
  }

  @computed
  get hasData() {
    return this._squadrons.length !== 0;
  }

  @computed
  get hasPendingSquadron() {
    return this._pendingSquadron !== null;
  }

  @computed
  get hasPendingDeleteSquadron() {
    return this._pendingDeleteSquadron !== null;
  }

  @computed
  get pendingDeleteSquadron() {
    return this._pendingDeleteSquadron;
  }

  @computed
  get pendingSquadron() {
    return this._pendingSquadron;
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get squadrons() {
    return this._squadrons;
  }
}