import { action, computed, observable } from 'mobx';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { FlightModel } from '../../flight/model/FlightModel';
import { NotificationStore } from './NotificationStore';

export class LocationFilterStore extends NotificationStore {
  @observable private _sites: SiteModel[] = [];
  @observable private _selectedSiteId: number | null = null;
  @observable private _selectedSquadronId: number | null = null;
  @observable private _selectedFlightId: number | null = null;

  hydrate(siteId: number, sites: SiteModel[]) {
    this._sites = sites;
    if (this._selectedSiteId !== siteId) {
      this.setSiteId(siteId);
    }
  }

  @computed
  get selectedSiteId() {
    return this._selectedSiteId;
  }

  @action.bound
  setSelectedSite(id: number | null) {
    this.setSiteId(id);
  }

  @computed
  get siteOptions() {
    return this._sites.map(site => {
      return {value: site.id, label: site.name};
    });
  }

  @computed
  get selectedSiteOption() {
    const found = this.siteOptions.find(x => x.value === this._selectedSiteId);
    return found === undefined ? null : found;
  }

  @computed
  get selectedSquadronOption() {
    const found = this.squadronOptions.find(x => x.value === this._selectedSquadronId);
    return found === undefined ? null : found;
  }

  @computed
  get selectedFlightOption() {
    const found = this.flightOptions.find(x => x.value === this._selectedFlightId);
    return found === undefined ? null : found;
  }

  @computed
  get selectedSquadronId() {
    return this._selectedSquadronId;
  }

  @computed
  get selectedSquadron(): SquadronModel | null {
    const squadrons = findById(this._sites, this._selectedSiteId) as SquadronModel[];
    return squadrons.find(squadron => squadron.id === this._selectedSquadronId) || null;
  }

  @action.bound
  setSelectedSquadron(id: number | null) {
    this._selectedSquadronId = id;
    this.setSelectedFlight(null);
  }

  @computed
  get squadronOptions() {
    const site = this._sites.find(s => s.id === this._selectedSiteId);
    if (site == null) {
      return [];
    }

    return site.squadrons.map((squad: SquadronModel) => {
      return {value: squad.id, label: squad.name};
    });
  }

  @computed
  get selectedFlightId() {
    return this._selectedFlightId;
  }

  @action.bound
  setSelectedFlight(id: number | null) {
    this._selectedFlightId = id;
  }

  @computed
  get flightOptions() {
    const site = this._sites.find(s => s.id === this._selectedSiteId);
    if (site == null) {
      return [];
    }

    const squadron = site.squadrons.find(sq => sq.id === this._selectedSquadronId);
    if (squadron == null) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  filterAirmen = (airmen: AirmanModel[]) => {
    return airmen
      .filter(this.bySquadron)
      .filter(this.byFlight);
  }

  private bySquadron = (airman: AirmanModel) => {
    return (airman.squadronId === this._selectedSquadronId || this._selectedSquadronId === null);
  }

  private byFlight = (airman: AirmanModel) => {
    return (airman.flightId === this._selectedFlightId || this._selectedFlightId === null);
  }

  private setSiteId(siteId: number | null) {
    this._selectedSiteId = siteId;
    const squadrons = findById(this._sites, this._selectedSiteId);
    if (squadrons.length === 1) {
      this.setSelectedSquadron(squadrons[0].id);
    } else {
      this.setSelectedSquadron(null);
    }
  }
}

type FilterableItems = SiteModel | SquadronModel | FlightModel;

function findById<T extends FilterableItems>(items: T[], id: number | null) {
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