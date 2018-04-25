import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { FilterOption } from '../../widgets/models/FilterOptionModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';

export class AirmanProfileManagerStore {
  @observable _airman: AirmanModel = AirmanModel.empty();
  @observable _sites: SiteModel[] = [];
  @observable _ripItems: AirmanRipItemModel[] = [];
  @observable _loading: boolean = false;

  constructor(private airmanRepository: AirmanRepository) {
  }

  hydrate(airman: AirmanModel, sites: SiteModel[], ripItems: AirmanRipItemModel[]) {
    this._airman = airman;
    this._sites = sites;
    this._ripItems = ripItems;
  }

  @computed
  get airman() {
    return this._airman;
  }

  @computed
  get sites() {
    return this._sites;
  }

  @computed
  get ripItems() {
    return this._ripItems;
  }

  @computed
  get siteOptions(): FilterOption[] {
    return this._sites.map(site => {
      return {value: site.id, label: site.fullName};
    });
  }

  @computed
  get squadronOptions(): FilterOption[] {
    debugger;
    const site = this._sites.find(site => site.id === this._airman.siteId);
    if (!site) {
      return [];
    }

    return site.squadrons.map(squadron => {
      return {value: squadron.id, label: squadron.name};
    });
  }

  @computed
  get flightOptions(): FilterOption[] {
    debugger;
    const site = this.getSite(this._airman.siteId);
    if (!site) {
      return [];
    }

    const squadron = this.getSquadron(this._airman.squadronId);
    if (!squadron) {
      return [];
    }

    return squadron.flights.map(flight => {
      return {value: flight.id, label: flight.name};
    });
  }

  @computed
  get expiredItemCount(): number {
    return this._ripItems
      .filter(item => item.isExpired)
      .length;
  }

  @computed
  get assignedItemCount(): number {
    return this._ripItems
      .filter(item => item.expirationDate != null && item.expirationDate.isValid())
      .length;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setState(key: keyof AirmanModel, value: any) {
    switch (key) {
      case 'siteId':
        this.setSquadronAndFlight(Number(value))
        break;
      case 'squadronId':
        this.setFlight(Number(value));
        break;
    }

    this._airman[(key as any)] = value;
  }

  @action.bound
  async save() {
    this._loading = true;
    this._airman = await this.airmanRepository.saveAirman(this.airman);
    this._loading = false;
  }

  private setSquadronAndFlight(siteId: number) {
    const site = this.getSite(siteId);
    if (!site || (site && site.squadrons.length < 1)) {
      return;
    }

    const squadron = site.squadrons[0];
    if (squadron.flights.length < 1) {
      return;
    }

    this._airman.squadronId = squadron.id;
    this._airman.flightId = squadron.flights[0].id;
  }

  private setFlight(squadronId: number) {
    const squadron = this.getSquadron(squadronId);
    if (!squadron || (squadron && squadron.flights.length < 1)) {
      return;
    }

    const flight = squadron.flights[0];
    this._airman.flightId = flight.id;
  }

  private getSite(id: number) {
    return this._sites.find(s => s.id === id);
  }

  private getSquadron(id: number) {
    const squadrons = this._sites.map(site => site.squadrons).reduce((acc, val) => acc.concat(val), []);
    return squadrons.find(s => s.id === id)
  }
}