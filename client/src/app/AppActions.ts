import { Repositories } from '../utils/Repositories';
import { Stores } from './stores';

export class AppActions {
  constructor(
    private stores: Partial<Stores>,
    private repositories: Partial<Repositories>) {
  }

  getSiteAndProfile = async () => {
    const [sites, profile] = await Promise.all([
      this.repositories.siteRepository!.findAll(),
      this.repositories.profileRepository!.findOne(),
    ]);

    await this.stores.profileStore!.hydrate(sites, profile);
  }
}