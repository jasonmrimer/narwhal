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
  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();

  constructor(repositories: Repositories, timeService: TimeService) {
    this.repositories = repositories;
    this.trackerFilterStore = new TrackerFilterStore();
    this.currencyStore = new CurrencyStore(this, this.trackerFilterStore, this.repositories);
    this.availabilityStore = new AvailabilityStore(this, this.repositories);
    this.plannerStore = new PlannerStore(timeService);
    this.sidePanelStore = new SidePanelStore();
    this.rosterHeaderStore = new RosterHeaderStore(this.trackerFilterStore);
  }

  async hydrate(siteId: number = UnfilteredValue) {
    this._loading = true;

    const [airmen, sites, certifications, qualifications, missions] = await Promise.all([
      this.repositories.airmanRepository.findAll(),
      this.repositories.siteRepository.findAll(),
      this.repositories.skillRepository.findAllCertifications(),
      this.repositories.skillRepository.findAllQualifications(),
      this.repositories.missionRepository.findAll()
    ]);

    this._airmen = airmen;
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

  @action.bound
  setSelectedAirman(airman: AirmanModel, tab: TabType) {
    this._selectedAirman = airman;
    this.currencyStore.airmanRipItemFormStore.setRipItems(airman.ripItems);
    this.sidePanelStore.setSelectedTab(tab);
    this.plannerStore.setSidePanelWeek(
      airman.isEmpty ?
        this.plannerStore.plannerWeek :
        this.plannerStore.sidePanelWeek
    );
  }

  @action.bound
  clearSelectedAirman() {
    this.availabilityStore.closeEventForm();
    this.setSelectedAirman(AirmanModel.empty(), TabType.AVAILABILITY);
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
    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId)!;
  }
}
