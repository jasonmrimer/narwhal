import { computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { SiteModel } from '../../site/models/SiteModel';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { FilterOption } from '../../widgets/models/FilterOptionModel';

export class AirmanProfileManagerStore {
  @observable _airman: AirmanModel = AirmanModel.empty();
  @observable _sites: SiteModel[] = [];
  @observable _ripItems: AirmanRipItemModel[] = [];

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
    const site = this._sites.find(site => site.id === this._airman.siteId);
    if (!site) {
      return [];
    }

    const squadron = site.squadrons.find(squadron => squadron.id === this._airman.squadronId);
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
}