import { Stores } from '../app/stores';
import { action } from 'mobx';

export class TopBarActions {

  constructor(private stores: Partial<Stores>) {
  }

  @action.bound
  resetProfile = async () => {
    const {profileStore} = this.stores;
    await profileStore!.resetProfile();
    location.reload();
  }
}
