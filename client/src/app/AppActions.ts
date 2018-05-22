import { Repositories } from '../utils/Repositories';
import { Stores } from './stores';
import { adminAbility, readerAbility, writerAbility } from './abilities';
import { ProfileModel } from '../profile/models/ProfileModel';

export class AppActions {
  static getProfileAbilities = (profile: ProfileModel) => {
    switch (profile.roleName) {
      case 'ADMIN':
        profile.ability = adminAbility;
        break;
      case 'WRITER':
        profile.ability = writerAbility;
        break;
      case 'READER':
      default:
        profile.ability = readerAbility;
        break;
    }
    return profile;
  }

  constructor(
    private stores: Partial<Stores>,
    private repositories: Partial<Repositories>) {
  }

  getSiteAndProfile = async () => {
    const [sites, profile] = await Promise.all([
      this.repositories.siteRepository!.findAll(),
      this.repositories.profileRepository!.findOne(),
    ]);

    this.stores.profileStore!.hydrate(sites, AppActions.getProfileAbilities(profile));
  }

}