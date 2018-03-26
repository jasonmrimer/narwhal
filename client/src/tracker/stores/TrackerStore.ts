import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { action, computed, observable } from 'mobx';
import { EventModel } from '../../event/models/EventModel';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { MissionStore } from '../../mission/stores/MissionStore';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { TimeService } from '../services/TimeService';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { EventActions } from '../../event/stores/EventActions';
import { SidePanelStore, TabType } from './SidePanelStore';
import { Moment } from 'moment';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import { TrackerFilterStore } from './TrackerFilterStore';
import { Repositories } from '../../Repositories';

export class TrackerStore implements EventActions {
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

  @observable private _pendingDeleteEvent: EventModel | null = null;

  constructor(repositories: Repositories, timeService: TimeService) {
    this.repositories = repositories;

    this.missionStore = new MissionStore(this.repositories.missionRepository);

    this.trackerFilterStore = new TrackerFilterStore();

    this.currencyStore = new CurrencyStore(
      new SkillFormStore(this.trackerFilterStore, this),
      this.repositories.ripItemRepository
    );

    this.availabilityStore = new AvailabilityStore(
      new AppointmentFormStore(this),
      new LeaveFormStore(this),
      new MissionFormStore(this, this.missionStore));

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
  async addEvent(event: EventModel) {
    try {
      const addedEvent = await this.repositories.eventRepository.save(event);
      await this.refreshAirmen(event);
      this.availabilityStore.closeEventForm();
      return addedEvent;
    } catch (e) {
      this.availabilityStore.setFormErrors(e);
      return event;
    }
  }

  @computed
  get pendingDeleteEvent() {
    return this._pendingDeleteEvent;
  }

  @action.bound
  removeEvent(event: EventModel) {
    this._pendingDeleteEvent = event;
  }

  @action.bound
  newEvent(airman: AirmanModel, date: Moment) {
    this._selectedAirman = airman;
    this.sidePanelStore.setSelectedTab(TabType.AVAILABILITY);
    this.availabilityStore.showEventForm(date);
  }

  @action.bound
  cancelPendingDelete() {
    this._pendingDeleteEvent = null;
  }

  @action.bound
  async executePendingDelete() {
    if (this._pendingDeleteEvent == null) {
      return;
    }
    try {
      await this.repositories.eventRepository.delete(this._pendingDeleteEvent);
      await this.refreshAirmen(this._pendingDeleteEvent);
      this.availabilityStore.closeEventForm();
    } catch (e) {
      this.availabilityStore.setFormErrors(e);
    }
    this._pendingDeleteEvent = null;
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

  private async refreshAirmen(item: { airmanId: number }) {
    this._airmen = await this.repositories.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId)!;
  }
}
