import { action, computed, observable } from 'mobx';

export class AdminSquadronModel {
  @observable private _siteId: number | null = null;
  @observable private _siteName: string = '';
  @observable private _squadronId: number | null = null;
  @observable private _squadronName: string = '';

  constructor(siteId: number | null = null,
              siteName: string = '',
              squadronId: number = 0,
              squadronName: string = ''
              ) {
    this._siteId = siteId;
    this._siteName = siteName;
    this._squadronId = squadronId;
    this._squadronName = squadronName;
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @computed
  get siteName() {
    return this._siteName;
  }

  @computed
  get squadronId() {
    return this._squadronId;
  }

  @computed
  get squadronName() {
    return this._squadronName;
  }

  @action.bound
  setSiteId(id: number | null) {
    this._siteId = id;
  }

  @action.bound
  setSiteName(name: string) {
    this._siteName = name;
  }

  @action.bound
  setSquadronId(id: number | null) {
    this._squadronId = id;
  }

  @action.bound
  setSquadronName(name: string) {
    this._squadronName = name;
  }
}