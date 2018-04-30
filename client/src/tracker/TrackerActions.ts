import { stores } from '../stores';

export class TrackerActions {
  static getAirmenBySite = async () => {
    const siteId = stores.locationFilterStore!.selectedSite;
    await stores.trackerStore.refreshAllAirmen(siteId);
  }
}