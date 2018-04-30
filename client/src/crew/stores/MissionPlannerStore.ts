import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { EventModel } from '../../event/models/EventModel';
import { MissionModel } from '../../mission/models/MissionModel';

export class MissionPlannerStore {
  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  private _mission: MissionModel;

  constructor(private repositories: Repositories) {
  }

  @action.bound
  hydrate(mission: MissionModel, airmen: AirmanModel[], events: EventModel[]) {
    this._loading = true;
    this._mission = mission;
    this._airmen = airmen;
    this._events = events;
    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get availableAirmen() {
    const busyAirmen = this.getIdsForBusyAirmen();
    return this._airmen.filter(airman => !busyAirmen.includes(airman.id));
  }

  @computed
  get unavailableAirmen() {
    const busyAirmen = this.getIdsForBusyAirmen();
    return this._airmen.filter(airman => busyAirmen.includes(airman.id));
  }

  async refreshAllAirmen(siteId: number) {
    this._airmen = await this.repositories.airmanRepository.findBySiteId(siteId);
  }

  async refreshAllEvents(siteId: number) {
    this._events = await this.repositories.eventRepository.findAllBySiteIdAndWithinPeriod(
      siteId,
      this._mission.startDateTime,
      this._mission.endDateTime || this._mission.startDateTime.clone().add(12, 'hours')
    );
  }

  private getIdsForBusyAirmen() {
    return this._events
      .map(event => event.airmanId)
      .filter((id, index, array) => index === array.indexOf(id));
  }
}
