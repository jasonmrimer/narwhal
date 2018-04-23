import { Repositories } from '../utils/Repositories';
import { stores } from '../stores';

export class AppActions {
  static getSiteAndProfile = async (repositories: Repositories) => {
    const [sites, profile] = await Promise.all([
      repositories.siteRepository.findAll(),
      repositories.profileRepository.findOne(),
    ]);

    await stores.profileStore!.hydrate(sites, profile);
  }
}