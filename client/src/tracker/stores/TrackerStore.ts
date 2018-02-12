import AirmanModel from '../../airman/models/AirmanModel';
import SiteModel from '../../site/models/SiteModel';
import AirmanRepository from '../../airman/repositories/AirmanRepository';
import SiteRepository from '../../site/repositories/SiteRepository';
import CertificationModel from '../../skills/models/CertificationModel';
import { action, computed, observable, toJS } from 'mobx';
import FilterOption, { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import EventModel from '../../event/models/EventModel';
import EventRepository from '../../event/repositories/EventRepository';
import TimeService from '../services/TimeService';
import { Moment } from 'moment';
import QualificationModel from '../../skills/models/QualificationModel';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { Skill } from '../../skills/models/Skill';
import { MissionModel } from '../../mission/models/MissionModel';
import MissionRepository from '../../mission/repositories/MissionRepository';
import CurrencyStore from '../../currency/stores/CurrencyStore';
import AvailabilityStore from '../../availability/stores/AvailabilityStore';

export default class TrackerStore {
  public currencyStore: CurrencyStore;
  public availabilityStore: AvailabilityStore;

  private airmanRepository: AirmanRepository;
  private siteRepository: SiteRepository;
  private skillRepository: SkillRepository;
  private eventRepository: EventRepository;
  private missionRepository: MissionRepository;
  private TimeService: TimeService;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _sites: SiteModel[] = [];
  @observable private _certifications: CertificationModel[] = [];
  @observable private _qualifications: QualificationModel[] = [];
  @observable private _missions: MissionModel[] = [];

  @observable private _siteId: number = UnfilteredValue;
  @observable private _squadronId: number = UnfilteredValue;
  @observable private _flightId: number = UnfilteredValue;
  @observable private _certificationIds: number[] = [];
  @observable private _qualificationIds: number[] = [];

  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();

  @observable private _plannerWeek: Moment[] = [];
  @observable private _sidePanelWeek: Moment[] = [];

  constructor(airmanRepository: AirmanRepository,
              siteRepository: SiteRepository,
              skillRepository: SkillRepository,
              eventRepository: EventRepository,
              missionRepository: MissionRepository,
              currencyStore: CurrencyStore,
              availabilityStore: AvailabilityStore,
              timeService: TimeService) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.skillRepository = skillRepository;
    this.eventRepository = eventRepository;
    this.missionRepository = missionRepository;
    this.currencyStore = currencyStore;
    this.availabilityStore = availabilityStore;
    this.TimeService = timeService;
    this._plannerWeek = this.TimeService.getCurrentWeek();
    this._sidePanelWeek = this.TimeService.getCurrentWeek();
  }

  async hydrate() {
    this._airmen = await this.airmanRepository.findAll();
    this._sites = await this.siteRepository.findAll();
    this._certifications = await this.skillRepository.findAllCertifications();
    this._qualifications = await this.skillRepository.findAllQualifications();
    this._missions = await this.missionRepository.findAll();
  }

  @computed
  get airmen() {
    let airmen = this._airmen;

    if (this._qualificationIds.length !== 0) {
      airmen = airmen.filter(airman => {
        const airmanQualificationIds = airman.qualifications.map(qual => qual.qualification.id);
        return !this._qualificationIds.some(val => airmanQualificationIds.indexOf(val) === -1);
      });
    }

    if (this._certificationIds.length !== 0) {
      airmen = airmen.filter(airman => {
        const airmanCertificationIds = airman.certifications.map(cert => cert.certification.id);
        return !this._certificationIds.some(val => airmanCertificationIds.indexOf(val) === -1);
      });
    }

    if (this._siteId === UnfilteredValue) {
      return airmen;
    }

    const site = this._sites.find(s => s.id === this._siteId)!;
    if (this._squadronId === UnfilteredValue) {
      return airmen.filter(airman => site.getAllFlightIds().includes(airman.flightId));
    }

    const squadron = site.squadrons.find(s => s.id === this._squadronId)!;
    if (this._flightId === UnfilteredValue) {
      return airmen.filter(airman => squadron.getAllFlightIds().includes(airman.flightId));
    }

    return airmen.filter(airman => airman.flightId === this._flightId);
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
    this.setSquadronId(UnfilteredValue);
  }

  @computed
  get squadronOptions() {
    if (this._siteId === UnfilteredValue) {
      return [];
    }
    const site = this._sites.find(s => s.id === this._siteId)!;
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
    const site = this._sites.find(s => s.id === this._siteId)!;
    const squadron = site.squadrons.find(s => s.id === this._squadronId)!;
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
      return {value: qual.id, label: qual.acronym};
    });
  }

  @action.bound
  setQualificationIds(options: FilterOption[]) {
    this._qualificationIds = options.map(option => Number(option.value));
  }

  @computed
  get qualificationIds() {
    return toJS(this._qualificationIds);
  }

  @computed
  get certificationIds() {
    return toJS(this._certificationIds);
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
  setSelectedAirman(airman: AirmanModel) {
    this._selectedAirman = airman;

    this._sidePanelWeek = airman.isEmpty ? this._plannerWeek : this._sidePanelWeek;

    this.availabilityStore.clearSelectedEvent();
    this.availabilityStore.setShowEventForm(false);

    this.currencyStore.clearSelectedSkill();
    this.currencyStore.setShowSkillForm(false);
  }

  @action.bound
  clearSelectedAirman() {
    this.setSelectedAirman(AirmanModel.empty());
  }

  @action.bound
  async addEvent(event: EventModel) {
    const pendingEvent = await this.eventRepository.save(event);
    if (pendingEvent.errors) {
      this.availabilityStore.setSelectedEvent(pendingEvent);
    } else {
      this._airmen = await this.airmanRepository.findAll();
      this._selectedAirman = this._airmen.find(a => a.id === event.airmanId)!;
    }
    return pendingEvent;
  }

  @action.bound
  async deleteEvent() {
    try {
      const event = this.availabilityStore.pendingDeleteEvent!;
      await this.eventRepository.delete(event);
      this._airmen = await this.airmanRepository.findAll();
      this._selectedAirman = this._airmen.find(a => a.id === event.airmanId)!;
      this.availabilityStore.setPendingDeleteEvent(null);
    } catch (e) {
      // TODO : handle me!
    }
  }

  @computed
  get plannerWeek() {
    return this._plannerWeek;
  }

  @action.bound
  incrementPlannerWeek() {
    this._plannerWeek = this.TimeService.incrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.TimeService.incrementWeek(this.sidePanelWeek);
  }

  @action.bound
  decrementPlannerWeek() {
    this._plannerWeek = this.TimeService.decrementWeek(this.plannerWeek);
    this._sidePanelWeek = this.TimeService.decrementWeek(this.sidePanelWeek);
  }

  @computed
  get sidePanelWeek() {
    return this._sidePanelWeek;
  }

  @action.bound
  incrementSidePanelWeek() {
    this._sidePanelWeek = this.TimeService.incrementWeek(this._sidePanelWeek);
  }

  @action.bound
  decrementSidePanelWeek() {
    this._sidePanelWeek = this.TimeService.decrementWeek(this._sidePanelWeek);
  }

  @action.bound
  async addAirmanSkill(skill: Skill) {
    await this.airmanRepository.saveSkill(skill);
    this._airmen = await this.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === skill.airmanId)!;
  }

  @action.bound
  async deleteAirmanSkill(skill: Skill) {
    await this.airmanRepository.deleteSkill(skill);
    this._airmen = await this.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === skill.airmanId)!;
  }

  @computed
  get missions() {
    return this._missions;
  }

  @computed
  get missionOptions() {
    return this._missions.map(msn => {
      return {value: msn.missionId, label: msn.atoMissionNumber};
    });
  }
}
