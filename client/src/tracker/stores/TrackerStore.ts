import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { action, computed, observable } from 'mobx';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { TimeService } from '../services/TimeService';
import { SidePanelStore, TabType } from './SidePanelStore';
import { Moment } from 'moment';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { TrackerFilterStore } from './TrackerFilterStore';
import { Repositories } from '../../Repositories';
import { EventModel } from '../../event/models/EventModel';

export class TrackerStore {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;
  public plannerStore: PlannerStore;
  public sidePanelStore: SidePanelStore;
  public rosterHeaderStore: RosterHeaderStore;
  public trackerFilterStore: TrackerFilterStore;

  private repositories: Repositories;
  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();

  constructor(repositories: Repositories, timeService: TimeService) {
    this.repositories = repositories;
    this.trackerFilterStore = new TrackerFilterStore();
    this.currencyStore = new CurrencyStore(this, this.trackerFilterStore, this.repositories);
    this.availabilityStore = new AvailabilityStore(this, this.repositories);
    this.plannerStore = new PlannerStore(timeService, this);
    this.sidePanelStore = new SidePanelStore();
    this.rosterHeaderStore = new RosterHeaderStore(this.trackerFilterStore);
  }

  async hydrate(siteId: number = UnfilteredValue) {
    this._loading = true;

    const week = this.plannerStore.plannerWeek;
    const [airmen, events, sites, certifications, qualifications, missions] = await Promise.all([
      this.repositories.airmanRepository.findAll(),
      this.repositories.eventRepository.findAllWithinPeriod(week[0], week[6]),
      this.repositories.siteRepository.findAll(),
      this.repositories.skillRepository.findAllCertifications(),
      this.repositories.skillRepository.findAllQualifications(),
      this.repositories.missionRepository.findAll()
    ]);

    this._airmen = airmen;
    this._events = events;
    this.trackerFilterStore.hydrate(siteId, sites);
    this.rosterHeaderStore.hydrate(certifications, qualifications);
    this.currencyStore.hydrate(certifications, qualifications);
    this.availabilityStore.hydrate(missions);

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
  get airmen() {
    const airmen = this.trackerFilterStore.filterAirmen(this._airmen);
    return this.rosterHeaderStore.filterAirmen(airmen);
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @computed
  get events() {
    return this._events;
  }

  getEventsByAirmanId(airmanId: number) {
    return this.events.filter(event => event.airmanId === airmanId);
  }

  @action.bound
  async setSelectedAirman(airman: AirmanModel, tab: TabType) {
    this._selectedAirman = airman;

    const ripItems = await this.repositories.ripItemRepository.findBySelectedAirman(airman.id);
    this.currencyStore.airmanRipItemFormStore.setRipItems(ripItems);

    await this.refreshAirmanEvents();

    this.sidePanelStore.setSelectedTab(tab);
  }

  @action.bound
  clearSelectedAirman() {
    this._selectedAirman = AirmanModel.empty();

    this.currencyStore.airmanRipItemFormStore.setRipItems([]);

    this.sidePanelStore.setSelectedTab(TabType.AVAILABILITY);

    this.plannerStore.setSidePanelWeek(this.plannerStore.plannerWeek);

    this.availabilityStore.closeEventForm();
  }

  @action.bound
  newEvent(airman: AirmanModel, date: Moment) {
    this._selectedAirman = airman;
    this.sidePanelStore.setSelectedTab(TabType.AVAILABILITY);
    this.availabilityStore.showEventForm(date);
  }

  @action.bound
  async updateAirmanShift(airman: AirmanModel, shiftType: ShiftType) {
    const updatedAirman = Object.assign({}, airman, {shift: shiftType});
    await this.repositories.airmanRepository.saveAirman(updatedAirman);
    this._airmen = await this.repositories.airmanRepository.findAll();
  }

  async refreshAirmen(item: { airmanId: number }) {
    this._airmen = await this.repositories.airmanRepository.findAll();
    await this.refreshEvents();

    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId)!;
    await this.refreshAirmanEvents();
  }

  async refreshEvents() {
    const week = this.plannerStore.plannerWeek;
    this._events = await this.repositories.eventRepository.findAllWithinPeriod(week[0], week[6]);
  }

  async refreshAirmanEvents() {
    if (this.selectedAirman.isEmpty) {
      return;
    }
    const week = this.plannerStore.sidePanelWeek;
    const airmanEvents = await this.repositories.eventRepository
      .findAllByAirmanIdAndWithinPeriod(this.selectedAirman.id, week[0], week[6]);
    this.availabilityStore.setAirmanEvents(airmanEvents);
  }
}
