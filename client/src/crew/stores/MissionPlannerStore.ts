import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { EventModel } from '../../event/models/EventModel';
import { MissionModel } from '../../mission/models/MissionModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';

export class MissionPlannerStore extends NotificationStore {
  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  private _mission: MissionModel;

  constructor(private repositories: Repositories) {
    super();
  }

  @action.bound
  hydrate(mission: MissionModel, airmen: AirmanModel[], events: EventModel[]) {
    this._mission = mission;
    this._airmen = airmen;
    this._events = events;
  }

  @computed
  get availableAirmen() {
    const busyAirmenIds = this.getIdsForBusyAirmen();
    const filteredAirmen = this._airmen.filter(airman => !busyAirmenIds.includes(airman.id));
    return filteredAirmen.filter(filteredAirman => filteredAirman.isAvailableForWork(this._mission.startDateTime));
  }

  @computed
  get unavailableAirmen() {
    const busyAirmenIds = this.getIdsForBusyAirmen();
    const filteredAirmenByEvents = this._airmen.filter(airman => busyAirmenIds.includes(airman.id));
    const filteredAirmenByDayOff = this._airmen
      .filter(airman => !busyAirmenIds.includes(airman.id))
      .filter(filteredAirman => !filteredAirman.isAvailableForWork(this._mission.startDateTime));
    return filteredAirmenByEvents
      .concat(filteredAirmenByDayOff)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  async refreshAllAirmen(siteId: number | null) {
    this._airmen = siteId === null ? [] : await this.repositories.airmanRepository.findBySiteId(siteId);
  }

  async refreshAllEvents(siteId: number | null) {
    this._events = siteId === null ? [] : await this.repositories.eventRepository.findAllBySiteIdAndWithinPeriod(
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
