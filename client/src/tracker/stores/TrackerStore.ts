import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { action, computed, observable } from 'mobx';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore, RefreshAirmen } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { TimeService } from '../services/TimeService';
import { SidePanelStore, TabType } from './SidePanelStore';
import { Moment } from 'moment';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { AllAirmenRefresher, LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { Repositories } from '../../utils/Repositories';
import { EventModel } from '../../event/models/EventModel';

export class TrackerStore implements AllAirmenRefresher, RefreshAirmen {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;
  public plannerStore: PlannerStore;
  public sidePanelStore: SidePanelStore;
  public rosterHeaderStore: RosterHeaderStore;
  public locationFilterStore: LocationFilterStore;

  private repositories: Repositories;

  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _selectedDate: Moment | null = null;

  constructor(repositories: Repositories, timeService: TimeService) {
    this.repositories = repositories;
    this.locationFilterStore = new LocationFilterStore(this);
    this.currencyStore = new CurrencyStore(this, this.locationFilterStore, this.repositories);
    this.availabilityStore = new AvailabilityStore(this, this.repositories);
    this.plannerStore = new PlannerStore(timeService, this);
    this.sidePanelStore = new SidePanelStore();
    this.rosterHeaderStore = new RosterHeaderStore(this.locationFilterStore);
  }

  async hydrate(siteId: number) {
    this._loading = true;

    const week = this.plannerStore.plannerWeek;
    const [airmen, events, sites, certifications, qualifications, missions] = await Promise.all([
      this.repositories.airmanRepository.findBySiteId(siteId),
      this.repositories.eventRepository.findAllBySiteIdAndWithinPeriod(siteId, week[0], week[6]),
      this.repositories.siteRepository.findAll(),
      this.repositories.skillRepository.findAllCertifications(),
      this.repositories.skillRepository.findAllQualifications(),
      this.repositories.missionRepository.findAll()
    ]);

    this._airmen = airmen;
    this._events = events;
    this.locationFilterStore.hydrate(siteId, sites);
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
    const airmen = this.locationFilterStore.filterAirmen(this._airmen);
    return this.rosterHeaderStore.filterAirmen(airmen);
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @computed
  get selectedDate() {
    return this._selectedDate;
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
    if (this._selectedAirman.id !== airman.id) {
      this.availabilityStore.closeEventForm();
      this.currencyStore.closeSkillForm();
    }
    this._selectedAirman = airman;
    this._selectedDate = null;
    this.sidePanelStore.setSelectedTab(tab);
    await this.refreshAirmanRipItems();
    await this.refreshAirmanEvents();
  }

  @action.bound
  clearSelectedAirman() {
    this._selectedAirman = AirmanModel.empty();
    this.plannerStore.setSidePanelWeek(this.plannerStore.plannerWeek);
  }

  @action.bound
  async newEvent(airman: AirmanModel, date: Moment | null) {
    this._selectedAirman = airman;
    this.sidePanelStore.setSelectedTab(TabType.AVAILABILITY);
    this._selectedDate = date;
    this.availabilityStore.showEventForm();
  }

  @action.bound
  async updateAirmanShift(airman: AirmanModel, shiftType: ShiftType) {
    const updatedAirman = Object.assign({}, airman, {shift: shiftType});
    await this.repositories.airmanRepository.saveAirman(updatedAirman);
    this._airmen = await this.repositories.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
  }

  async refreshAllAirmen() {
    this._airmen = await this.repositories.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
    await this.refreshEvents();
    await this.refreshAirmanEvents();
  }

  async refreshAirmen(item: { airmanId: number }) {
    this._airmen = await this.repositories.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
    await this.refreshEvents();

    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId) || AirmanModel.empty();
    await this.refreshAirmanEvents();
  }

  async refreshEvents() {
    const week = this.plannerStore.plannerWeek;
    this._events = await this.repositories.eventRepository
      .findAllBySiteIdAndWithinPeriod(this.locationFilterStore.selectedSite, week[0], week[6]);
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

  async refreshAirmanRipItems() {
    if (this.selectedAirman.isEmpty) {
      return;
    }
    const ripItems = await this.repositories.ripItemRepository
      .findBySelectedAirman(this.selectedAirman.id);
    this.currencyStore.airmanRipItemFormStore.setRipItems(ripItems);
  }
}
