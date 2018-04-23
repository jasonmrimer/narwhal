import { action, computed, observable } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { UnfilteredValue } from '../models/FilterOptionModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { FlightModel } from '../../flight/model/FlightModel';

export class LocationFilterStore {
  @observable private _sites: SiteModel[] = [];
  @observable private _selectedSite: number = UnfilteredValue;
  @observable private _selectedSquadron: number = UnfilteredValue;
  @observable private _selectedFlight: number = UnfilteredValue;

  hydrate(siteId: number, sites: SiteModel[]) {
    this._sites = sites;
    if (this._selectedSite !== siteId) {
      this.setSiteId(siteId);
    }
  }

  @computed
  get selectedSite() {
    return this._selectedSite;
  }

  @action.bound
  setSelectedSite(id: number) {
    this.setSiteId(id);
  }

  @computed
  get siteOptions() {
    return this._sites.map(site => {
      return {value: site.id, label: site.name};
    });
  }

  @computed
  get selectedSquadron() {
    return this._selectedSquadron;
  }

  @action.bound
  setSelectedSquadron(id: number) {
    this._selectedSquadron = id;
    this.setSelectedFlight(UnfilteredValue);
  }

  @computed
  get squadronOptions() {
    return findById(this._sites, this._selectedSite)
      .map((squad: SquadronModel) => {
        return {value: squad.id, label: squad.name};
      });
  }

  @computed
  get selectedFlight() {
    return this._selectedFlight;
  }

  @action.bound
  setSelectedFlight(id: number) {
    this._selectedFlight = id;
  }

  @computed
  get flightOptions() {
    const squadrons = findById(this._sites, this._selectedSite);
    return findById(squadrons, this._selectedSquadron)
      .map(flight => {
        return {value: flight.id, label: flight.name};
      });
  }

  filterAirmen(airmen: AirmanModel[]) {
    return airmen
      .filter(this.bySquadron)
      .filter(this.byFlight);
  }

  private bySquadron = (airman: AirmanModel) => {
    return (airman.squadronId === this._selectedSquadron || this._selectedSquadron === UnfilteredValue);
  }

  private byFlight = (airman: AirmanModel) => {
    return (airman.flightId === this._selectedFlight || this._selectedFlight === UnfilteredValue);
  }

  private setSiteId(siteId: number) {
    this._selectedSite = siteId;
    const squadrons = findById(this._sites, this._selectedSite);
    if (squadrons.length === 1) {
      this.setSelectedSquadron(squadrons[0].id);
    } else {
      this.setSelectedSquadron(UnfilteredValue);
    }
  }
}

type FilterableItems = SiteModel | SquadronModel | FlightModel;

function findById<T extends FilterableItems>(items: T[], id: number) {
  const item = items.find(itm => itm.id === id);
  if (item) {
    if (item instanceof SiteModel) {
      return item.squadrons;
    } else if (item instanceof SquadronModel) {
      return item.flights;
    }
  }
  return [];
}