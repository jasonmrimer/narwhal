import { Stores } from '../app/stores';
import { action } from 'mobx';
import { Repositories } from '../utils/Repositories';

export class TopBarActions {

  constructor(
    private stores: Partial<Stores>,
    private repositories: Partial<Repositories>
  ) {
  }

  @action.bound
  resetProfile = async () => {
    const {profileStore} = this.stores;
    await profileStore!.resetProfile();
    location.reload();
  }

  @action.bound
  async getPendingRequests() {
    const {pendingEventStore, profileStore} = this.stores;
    await profileStore!.performLoading(async () => {
      const {airmanRepository, eventRepository} = this.repositories;
      const site = profileStore!.currentProfileSite;
      const siteId = site!.id;
      const [airmen, events] = await Promise.all([
        airmanRepository!.findBySiteId(siteId),
        eventRepository!.findAllPendingEventsBySiteId(siteId)
      ]);

      pendingEventStore!.hydrate(airmen, events, site!);
      pendingEventStore!.setShowList();
    });
  }
}
