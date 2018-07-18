import { Stores } from '../app/stores';

export class TrackerActions {
  constructor(private stores: Partial<Stores>) {
  }

  getAirmenBySite = async () => {
    const siteId = this.stores.locationFilterStore!.selectedSiteId;
    await this.stores.trackerStore!.refreshAllAirmen(siteId, this.stores.plannerStore!.plannerTimeSpan);
  }
}