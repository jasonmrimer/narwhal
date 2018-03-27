import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { action, computed, observable } from 'mobx';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { MissionStore } from '../../mission/stores/MissionStore';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { TimeService } from '../services/TimeService';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { SidePanelStore, TabType } from './SidePanelStore';
import { Moment } from 'moment';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { TrackerFilterStore } from './TrackerFilterStore';
import { Repositories } from '../../Repositories';

export class TrackerStore {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;
  public plannerStore: PlannerStore;
  public missionStore: MissionStore;
  public sidePanelStore: SidePanelStore;
  public rosterHeaderStore: RosterHeaderStore;
  public trackerFilterStore: TrackerFilterStore;

  private repositories: Repositories;

  @observable private _loading: boolean = false;

  @observable private _airmen: AirmanModel[] = [];

  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();

  constructor(repositories: Repositories, timeService: TimeService) {
    this.repositories = repositories;
    this.missionStore = new MissionStore(this.repositories.missionRepository);
    this.trackerFilterStore = new TrackerFilterStore();
    this.currencyStore = new CurrencyStore(
      new SkillFormStore(this.trackerFilterStore, this),
      this.repositories.ripItemRepository
    );
    this.availabilityStore = new AvailabilityStore(this, this.missionStore, this.repositories);
    this.plannerStore = new PlannerStore(timeService);
    this.sidePanelStore = new SidePanelStore();
    this.rosterHeaderStore = new RosterHeaderStore(this.trackerFilterStore);
  }

  async hydrate(siteId: number = UnfilteredValue) {
    this._loading = true;

    const results = await Promise.all([
      this.repositories.siteRepository.findAll(),
      this.repositories.airmanRepository.findAll(),
      this.repositories.skillRepository.findAllCertifications(),
      this.repositories.skillRepository.findAllQualifications(),
      this.missionStore.hydrate(),
    ]);

    this._airmen = results[1];

    this.trackerFilterStore.hydrate(siteId, results[0]);
    this.rosterHeaderStore.hydrate(results[2], results[3]);
    this.currencyStore.hydrate(results[2], results[3]);

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
  async addSkill(skill: Skill) {
    try {
      await this.repositories.airmanRepository.saveSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
  }

  @action.bound
  async removeSkill(skill: Skill) {
    try {
      await this.repositories.airmanRepository.deleteSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
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
