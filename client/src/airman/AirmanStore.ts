import AirmanRepository from './repositories/AirmanRepository';
import { action, computed, observable } from 'mobx';
import AirmanModel from './models/AirmanModel';
import { SquadronStore } from '../squadron/SquadronStore';
import { FlightStore } from '../flight/FlightStore';
import { CertificationStore } from './CertificationStore';
import EventModel from '../event/EventModel';

export class AirmanStore {
  @observable private _airmen: AirmanModel[] = [];
  @observable private selectedAirman: AirmanModel = AirmanModel.empty();
  @observable private _selectedAirmanEvents: EventModel[] = this.selectedAirman.events;
  constructor(private repository: AirmanRepository,
              private squadronStore: SquadronStore,
              private flightStore: FlightStore,
              private certificationStore: CertificationStore) {
  }

  @action
  async fetchAllAirman() {
    this._airmen = await this.repository.findAll();
  }

  @action.bound
  async fetchBySquadronId(id: number) {
    this.squadronStore.setSelectedSquadronId(id);
    this.flightStore.setSelectedFlightId(-1);
    if (id > -1) {
      this._airmen = await this.repository.findBySquadron(id);
    } else {
      await this.fetchAllAirman();
    }
  }

  @action.bound
  async fetchByFlight(id: number) {
    this.flightStore.setSelectedFlightId(id);
    if (id > -1) {
      this._airmen = await this.repository.findByFlight(id);
    } else {
      await this.fetchBySquadronId(this.squadronStore.currentOptionId);
    }
  }

  @action
  addEvent(event: EventModel) {
    this.selectedAirman.events.push(event);
    this._selectedAirmanEvents.push(event);
  }

  @action
  setAirmen(airmen: AirmanModel[]) {
    this._airmen = airmen;
  }

  @action
  setAirman(airman?: AirmanModel) {
    this.selectedAirman = airman ? airman : AirmanModel.empty();
    this._selectedAirmanEvents = this.selectedAirman.events;
  }

  @computed
  get airmen() {
    const selectedCertificationIds = this.certificationStore.selectedCertificationIds;
    let airmen = this._airmen;
    if (selectedCertificationIds.length > 0) {
      return airmen.filter(airman => {
        const airmanCertificationIds = airman.certifications.map(cert => cert.id);
        return !selectedCertificationIds.some(val => airmanCertificationIds.indexOf(val) === -1);
      });
    } else {
      return airmen;
    }
  }

  @computed
  get getSelectedAirman() {
    return this.selectedAirman;
  }

  @computed
  get selectedAirmanEvents() {
    return this._selectedAirmanEvents;
  }

  @computed
  get isSelectedAirmanFilled() {
    return this.selectedAirman.id > -1;
  }
}