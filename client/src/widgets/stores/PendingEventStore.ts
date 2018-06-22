import { NotificationStore } from './NotificationStore';
import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { EventModel } from '../../event/models/EventModel';
import { SiteModel } from '../../site/models/SiteModel';

export class PendingEventStore extends NotificationStore {
  @observable private _airmen: AirmanModel[];
  @observable private _events: EventModel[];
  @observable private _site: SiteModel;
  @observable private _showList: boolean = false;

  constructor() {
    super();
  }

  hydrate(airmen: AirmanModel[], events: EventModel[], site: SiteModel) {
    this._airmen = airmen;
    this._events = events;
    this._site = site;
  }

  findAirman(airmanId: number) {
    const myAirman = this._airmen.find((airman: AirmanModel) => airman.id === airmanId);
    if (myAirman) {
      return myAirman;
    }
    return AirmanModel.empty();
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get events() {
    return this._events;
  }

  @computed
  get site() {
    return this._site;
  }

  @computed
  get showList() {
    return this._showList;
  }

  @action.bound
  setShowList() {
    this._showList = !this._showList;
  }
}
