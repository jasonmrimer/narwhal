import { AirmanModel } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { action, computed, observable } from 'mobx';
import { EventModel } from '../../event/models/EventModel';
import { EventRepository } from '../../event/repositories/EventRepository';
import { QualificationModel } from '../../skills/models/QualificationModel';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { CurrencyStore } from '../../currency/stores/CurrencyStore';
import { AvailabilityStore } from '../../availability/stores/AvailabilityStore';
import { PlannerStore } from '../../roster/stores/PlannerStore';
import { MissionStore } from '../../mission/stores/MissionStore';
import { FilterOption, UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { MissionRepository } from '../../mission/repositories/MissionRepository';
import { TimeService } from '../services/TimeService';
import { LeaveFormStore } from '../../event/stores/LeaveFormStore';
import { MissionFormStore } from '../../event/stores/MissionFormStore';
import { AppointmentFormStore } from '../../event/stores/AppointmentFormStore';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { EventActions } from '../../event/stores/EventActions';
import { SidePanelStore, TabType } from './SidePanelStore';

export class TrackerStore implements EventActions {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;
  public plannerStore: PlannerStore;
  public missionStore: MissionStore;
  public sidePanelStore: SidePanelStore;

  private airmanRepository: AirmanRepository;
  private siteRepository: SiteRepository;
  private skillRepository: SkillRepository;
  private eventRepository: EventRepository;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _sites: SiteModel[] = [];
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];

  @observable private _siteId: number = UnfilteredValue;
  @observable private _squadronId: number = UnfilteredValue;
  @observable private _flightId: number = UnfilteredValue;
  @observable private _certificationIds: number[] = [];
  @observable private _qualificationIds: number[] = [];

  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _pendingDeleteEvent: EventModel | null = null;

  constructor(airmanRepository: AirmanRepository,
              siteRepository: SiteRepository,
              skillRepository: SkillRepository,
              eventRepository: EventRepository,
              timeService: TimeService,
              missionRepository: MissionRepository) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.skillRepository = skillRepository;
    this.eventRepository = eventRepository;

    const missionStore = new MissionStore(missionRepository);

    this.currencyStore = new CurrencyStore(
      new SkillFormStore(this)
    );

    this.availabilityStore = new AvailabilityStore(
      new AppointmentFormStore(this),
      new LeaveFormStore(this),
      new MissionFormStore(this, missionStore)
    );

    this.missionStore = missionStore;

    this.plannerStore = new PlannerStore(timeService);

    this.sidePanelStore = new SidePanelStore();
  }

  async hydrate(siteId: number = UnfilteredValue) {
    const results = await Promise.all([
      this.siteRepository.findAll(),
      this.airmanRepository.findAll(),
      this.skillRepository.findAllCertifications(),
      this.skillRepository.findAllQualifications(),
      this.missionStore.hydrate()
    ]);

    this._sites = results[0];
    this._airmen = results[1];
    this._certifications = results[2];
    this._qualifications = results[3];

    this.setSiteId(siteId);
  }

  @computed
  get airmen() {
    return this._airmen
      .filter(this.byQualifications)
      .filter(this.byCertifications)
      .filter(this.bySite)
      .filter(this.bySquadron)
      .filter(this.byFlight);
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get siteOptions() {
    return this._sites.map(site => {
      return {value: site.id, label: site.name};
    });
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @action.bound
  setSiteId(id: number) {
    this._siteId = id;

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return;
    }

    if (site.squadrons.length === 1) {
      this.setSquadronId(site.squadrons[0].id);
    } else {
      this.setSquadronId(UnfilteredValue);
    }
  }

  @computed
  get squadronOptions() {
    if (this._siteId === UnfilteredValue) {
      return [];
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return [];
    }

    return site.squadrons.map(squad => {
      return {value: squad.id, label: squad.name};
    });
  }

  @computed
  get squadronId() {
    return this._squadronId;
  }

  @action.bound
  setSquadronId(id: number) {
    this._squadronId = id;
    this.setFlightId(UnfilteredValue);
  }

  @computed
  get flightOptions() {
    if (this._siteId === UnfilteredValue || this._squadronId === UnfilteredValue) {
      return [];
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return [];
    }

    const squadron = site.squadrons.find(s => s.id === this._squadronId);
    if (squadron == null) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  @computed
  get flightId() {
    return this._flightId;
  }

  @action.bound
  setFlightId(id: number) {
    this._flightId = id;
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @action.bound
  setCertificationIds(options: FilterOption[]) {
    this._certificationIds = options.map(option => Number(option.value));
  }

  @computed
  get certificationOptions() {
    return this._certifications.map(cert => {
      return {value: cert.id, label: cert.title};
    });
  }

  @computed
  get qualificationOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym} - ${qual.title}`};
    });
  }

  @computed
  get qualificationFilterOptions() {
    return this._qualifications.map(qual => {
      return {value: qual.id, label: `${qual.acronym}`};
    });
  }

  @action.bound
  setQualificationIds(options: FilterOption[]) {
    this._qualificationIds = options.map(option => Number(option.value));
  }

  @computed
  get qualificationIds() {
    return this._qualificationIds;
  }

  @computed
  get certificationIds() {
    return this._certificationIds;
  }

  @computed
  get qualifications() {
    return this._qualifications;
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @action.bound
  setSelectedAirman(airman: AirmanModel, tab: TabType) {
    this._selectedAirman = airman;
    this.sidePanelStore.setSelectedTab(tab);
    this.plannerStore.setSidePanelWeek(
      airman.isEmpty ?
        this.plannerStore.plannerWeek :
        this.plannerStore.sidePanelWeek
    );
  }

  @action.bound
  clearSelectedAirman() {
    this.setSelectedAirman(AirmanModel.empty(), TabType.AVAILABILITY);
  }

  @action.bound
  async addEvent(event: EventModel) {
    try {
      const addedEvent = await this.eventRepository.save(event);
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
  cancelPendingDelete() {
    this._pendingDeleteEvent = null;
  }

  @action.bound
  async executePendingDelete() {
    if (this._pendingDeleteEvent == null) {
      return;
    }
    try {
      await this.eventRepository.delete(this._pendingDeleteEvent);
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
      await this.airmanRepository.saveSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
  }

  @action.bound
  async removeSkill(skill: Skill) {
    try {
      await this.airmanRepository.deleteSkill(skill);
      await this.refreshAirmen(skill);
    } catch (e) {
      this.currencyStore.setFormErrors(e);
    }
  }

  private async refreshAirmen(item: { airmanId: number }) {
    this._airmen = await this.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === item.airmanId)!;
  }

  private byQualifications = (airman: AirmanModel) => {
    if (this._qualificationIds.length === 0) {
      return true;
    }
    return !this._qualificationIds.some(val => airman.qualificationIds.indexOf(val) === -1);
  }

  private byCertifications = (airman: AirmanModel) => {
    if (this._certificationIds.length === 0) {
      return true;
    }
    return !this._certificationIds.some(val => airman.certificationIds.indexOf(val) === -1);
  }

  private bySite = (airman: AirmanModel) => {
    if (this._siteId === UnfilteredValue) {
      return true;
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return false;
    }

    return site.getAllFlightIds().includes(airman.flightId);
  }

  private bySquadron = (airman: AirmanModel) => {
    if (this._squadronId === UnfilteredValue) {
      return true;
    }

    const site = this._sites.find(s => s.id === this._siteId);
    if (site == null) {
      return false;
    }

    const squadron = site.squadrons.find(s => s.id === this._squadronId);
    if (squadron == null) {
      return false;
    }

    return squadron.getAllFlightIds().includes(airman.flightId);
  }

  private byFlight = (airman: AirmanModel) => {
    if (this._flightId === UnfilteredValue) {
      return true;
    }
    return airman.flightId === this._flightId;
  }
}
