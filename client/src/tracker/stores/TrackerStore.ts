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

export default class TrackerStore {
  private airmanRepository: AirmanRepository;
  private siteRepository: SiteRepository;
  private certificationRepository: CertificationRepository;
  private eventRepository: EventRepository;

  @observable private _airmen: AirmanModel[] = [];
  @observable private _sites: SiteModel[] = [];
  @observable private _certifications: CertificationModel[] = [];

  @observable private _siteId: number = UnfilteredValue;
  @observable private _squadronId: number = UnfilteredValue;
  @observable private _flightId: number = UnfilteredValue;
  @observable private _certificationIds: number[] = [];
  @observable private _selectedAirman: AirmanModel = AirmanModel.empty();

  constructor(airmanRepository: AirmanRepository,
              siteRepository: SiteRepository,
              certificationRepository: CertificationRepository,
              eventRepository: EventRepository) {
    this.airmanRepository = airmanRepository;
    this.siteRepository = siteRepository;
    this.certificationRepository = certificationRepository;
    this.eventRepository = eventRepository;
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
  get certificationOptions() {
    return this._certifications.map(cert => {
      return {value: cert.id, label: cert.title};
    });
  }

  @computed
  get flightId() {
    return this._flightId;
  }

  @computed
  get squadronId() {
    return this._squadronId;
  }

  @computed
  get siteId() {
    return this._siteId;
  }

  @computed
  get certificationIds() {
    return toJS(this._certificationIds);
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get selectedAirman() {
    return this._selectedAirman;
  }

  @action.bound
  setSiteId(id: number) {
    this._siteId = id;
    this.setSquadronId(UnfilteredValue);
  }

  @action.bound
  setSquadronId(id: number) {
    this._squadronId = id;
    this.setFlightId(UnfilteredValue);
  }

  @action.bound
  setFlightId(id: number) {
    this._flightId = id;
  }

  @action.bound
  setCertificationIds(options: FilterOption[]) {
    this._certificationIds = options.map(option => option.value);
  }

  @action.bound
  setSelectedAirman(airman: AirmanModel) {
    this._selectedAirman = airman;
  }

  @action.bound
  async addEvent(event: EventModel) {
    const savedEvent = await this.eventRepository.save(event);
    const airmenCopy = this._airmen.slice();
    const airman = airmenCopy.find(a => a.id === savedEvent.airmanId)!;
    airman.events.push(savedEvent);
    this._airmen = airmenCopy;
    this._selectedAirman = airman;
    return savedEvent;
  }

  @action.bound
  async deleteEvent(event: EventModel) {
    const resp = await this.eventRepository.delete(event);
    if (resp.status === 200) {
      this._airmen = await this.airmanRepository.findAll();
      this._selectedAirman = this._airmen.find(a => a.id === event.airmanId)!;
    }
  }
}