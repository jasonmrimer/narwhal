import { action, computed, observable } from 'mobx';

export class AdminSiteModel {
  @observable private _siteId: number | null = null;
  @observable private _siteName: string = '';

  constructor(siteId: number | null = null,
              siteName: string = '',
  ) {
    this._siteId = siteId;
    this._siteName = siteName;
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @computed
  get siteName() {
    return this._siteName;
  }

  @action.bound
  setSiteId(id: number | null) {
    this._siteId = id;
  }

  @action.bound
  setSiteName(name: string) {
    this._siteName = name;
  }
}