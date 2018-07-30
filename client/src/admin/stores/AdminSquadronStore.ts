import { action, computed, observable } from 'mobx';
import { AdminSquadronModel } from '../models/AdminSquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AdminSiteModel } from '../models/AdminSiteModel';
import { NestedModel } from '../models/NestedModel';

export class AdminSquadronStore extends NotificationStore {
  @observable private _pendingDeleteSquadron: AdminSquadronModel | null = null;
  @observable private _pendingSquadron: AdminSquadronModel | null = null;
  @observable private _sites: AdminSiteModel[] = [];
  @observable private _squadrons: NestedModel<AdminSiteModel, AdminSquadronModel>[] = [];

  @action.bound
  hydrate(squadrons: AdminSquadronModel[]) {
    this._squadrons = [];
    squadrons.forEach(s => {
      let parent = this._squadrons.find(sq => sq.parent.siteName === s.siteName);
      if (parent === undefined) {
        parent =
          new NestedModel<AdminSiteModel, AdminSquadronModel>(
            new AdminSiteModel(s.siteId, s.siteName));
        this._squadrons.push(parent);
      }
      parent.children.push(s);
    });
  }

  @action.bound
  defaultPendingSquadron() {
    this._pendingSquadron = null;
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
    return this._squadrons.sort((a, b) => {
      return a.parent.siteName > b.parent.siteName ? 1 : -1;
    });
  }
}