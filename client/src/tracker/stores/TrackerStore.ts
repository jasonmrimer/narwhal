import {AirmanModel, ShiftType} from '../../airman/models/AirmanModel';
import {action, computed, observable} from 'mobx';
import {Moment} from 'moment';
import {Repositories} from '../../utils/Repositories';
import {EventModel} from '../../event/models/EventModel';
import {NotificationStore} from '../../widgets/stores/NotificationStore';

export class TrackerStore extends NotificationStore {
  private repositories: Repositories;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _siteId: number;

  constructor(repositories: Repositories) {
    super();
    this.repositories = repositories;
  }

  hydrate(airmen: AirmanModel[], events: EventModel[], siteId: number) {
    this._airmen = airmen;
    this._events = events;
    this._siteId = siteId;
    if (!this._selectedAirman.isEmpty) {
      this._selectedAirman = this._airmen.find(a => a.id === this._selectedAirman.id) || AirmanModel.empty();
    }
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @computed
  get events() {
    return this._events;
  }

  getEventsByAirmanId = (airmanId: number) => {
    return this._events.filter(event => event.airmanId === airmanId);
  }

  getDailyEventsByAirmanId = (airmanId: number, day: Moment) => {
    return this.getEventsByAirmanId(airmanId).filter(event => event.isOnDay(day));
  }

  @action.bound
  setSelectedAirman(airman: AirmanModel) {
    this._selectedAirman = airman;
  }

  @action.bound
  clearSelectedAirman() {
    this._selectedAirman = AirmanModel.empty();
  }

  @action.bound
  async updateAirmanShift(airman: AirmanModel, shiftType: ShiftType) {
    if (airman.shift === shiftType) {
      return;
    }

    const savedAirman = await this.repositories.airmanRepository.saveAirman(
      Object.assign({}, airman, {shift: shiftType})
    );
    const index = this._airmen.findIndex(a => a.id === savedAirman.id);
    this._airmen.splice(index, 1, savedAirman);
  }

  @action.bound
  async refreshAllAirmen(selectedSiteId: number, week: Moment[]) {
    this._siteId = selectedSiteId;
    this._airmen = await  this.repositories.airmanRepository.findBySiteId(this._siteId);
    await this.refreshEvents(week);
  }

  @action.bound
  async refreshEvents(week: Moment[]) {
    this._events = await this.repositories.eventRepository
      .findAllBySiteIdAndWithinPeriod(this._siteId, week[ 0 ], week[ 6 ]);
  }

  async refreshAirmen(siteId: number, airmanId: number) {
    this._airmen = await this.repositories.airmanRepository.findBySiteId(siteId);
    this._selectedAirman = this._airmen.find(a => a.id === airmanId) || AirmanModel.empty();
  }
}
