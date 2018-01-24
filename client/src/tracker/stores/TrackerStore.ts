import AirmanModel from '../../airman/models/AirmanModel';
import SiteModel from '../../site/models/SiteModel';
import AirmanRepository from '../../airman/repositories/AirmanRepository';
import SiteRepository from '../../site/repositories/SiteRepository';
import CertificationRepository from '../../airman/repositories/CertificationRepository';
import CertificationModel from '../../airman/models/CertificationModel';
import { action, computed, observable, toJS } from 'mobx';
import FilterOption, { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import EventModel from '../../event/EventModel';
import EventRepository from '../../event/repositories/EventRepository';
import TimeService from '../services/TimeService';
import { Moment } from 'moment';

export default class TrackerStore {
  private airmanRepository: AirmanRepository;
  private siteRepository: SiteRepository;
  private certificationRepository: CertificationRepository;
  private eventRepository: EventRepository;
  private TimeService: TimeService;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _sites: SiteModel[] = [];
  @observable private _certifications: CertificationModel[] = [];

  @observable private _siteId: number = UnfilteredValue;
  @observable private _squadronId: number = UnfilteredValue;
  @observable private _flightId: number = UnfilteredValue;
  @observable private _certificationIds: number[] = [];

  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _selectedEvent: EventModel | null = null;

  @observable private _plannerWeek: Moment[] = [];
  @observable private _sidePanelWeek: Moment[] = [];

  constructor(airmanRepository: AirmanRepository,
              siteRepository: SiteRepository,
              certificationRepository: CertificationRepository,
              eventRepository: EventRepository,
              timeService: TimeService) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.certificationRepository = certificationRepository;
    this.eventRepository = eventRepository;
    this.TimeService = timeService;
    this._plannerWeek = this.TimeService.getCurrentWeek();
    this._sidePanelWeek = this.TimeService.getCurrentWeek();
  }

  async hydrate() {
    this._airmen = await this.airmanRepository.findAll();
    this._sites = await this.siteRepository.findAll();
    this._certifications = await this.certificationRepository.findAll();
  }

  @computed
  get airmen() {
    let airmen = this._airmen;
    if (this._certificationIds.length !== 0) {
      airmen = airmen.filter(airman => {
        const airmanCertificationIds = airman.certifications.map(cert => cert.id);
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
    this._certificationIds = options.map(option => option.value);
  }

  @computed
  get certificationOptions() {
    return this._certifications.map(cert => {
      return {value: cert.id, label: cert.title};
    });
  }

  @computed
  get certificationIds() {
    return toJS(this._certificationIds);
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @action.bound
  setSelectedAirman(airman: AirmanModel) {
    this._selectedAirman = airman;
    this._sidePanelWeek = airman.isEmpty() ? this._plannerWeek : this._sidePanelWeek;
    this._selectedEvent = null;
  }

  @action.bound
  clearSelectedAirman() {
    this.setSelectedAirman(AirmanModel.empty());
  }
  
  @computed
  get selectedEvent() {
    return this._selectedEvent;
  }

  @action.bound
  setSelectedEvent(event: EventModel) {
    this._selectedEvent = event;
  }

  @action.bound
  clearSelectedEvent() {
    this._selectedEvent = null;
  }

  @action.bound
  async addEvent(event: EventModel) {
    const savedEvent = await this.eventRepository.save(event);
    this._airmen = await this.airmanRepository.findAll();
    this._selectedAirman = this._airmen.find(a => a.id === event.airmanId)!;
    return savedEvent;
  }

  @action.bound
  async deleteEvent(event: EventModel) {
    try {
      await this.eventRepository.delete(event);
      this._airmen = await this.airmanRepository.findAll();
      this._selectedAirman = this._airmen.find(a => a.id === event.airmanId)!;
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

  @computed
  get sidePanelWeek() {
    return this._sidePanelWeek;
  }

  @action.bound
  incrementSidePanelWeek() {
    this._sidePanelWeek = this.TimeService.incrementWeek(this._sidePanelWeek);
  }
}