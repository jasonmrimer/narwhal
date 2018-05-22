import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../models/ProfileModel';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { Repositories } from '../../utils/Repositories';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { AppActions } from '../../app/AppActions';

export class ProfileSitePickerStore extends NotificationStore {
  private profileRepository: ProfileRepository;
  @observable private _profile: ProfileModel | null = null;
  @observable private _sites: SiteModel[];
  @observable private _pendingSite: SiteModel | null = null;
  @observable private _pendingSquadron: SquadronModel | null = null;

  constructor(repositories: Repositories) {
    super();
    this.profileRepository = repositories.profileRepository;
  }

  @action.bound
  hydrate(sites: SiteModel[], profile: ProfileModel) {
    this._sites = sites;
    this._profile = profile;
  }

  @computed
  get profile() {
    return this._profile;
  }

  @action.bound
  async savePendingSite() {
    if (this._profile === null) {
      return;
    }

    if (this._pendingSite && this._pendingSquadron == null) {
      let profile = await this.profileRepository.updateSite(this._pendingSite.id);
      this._profile = AppActions.getProfileAbilities(profile);
    }

    if (this._pendingSite && this._pendingSquadron) {
      let profile =
        await this.profileRepository.updateSiteAndSquadron(this._pendingSite.id, this._pendingSquadron.id);
      this._profile = AppActions.getProfileAbilities(profile);
    }
  }

  @computed
  get pendingSite() {
    return this._pendingSite;
  }

  @computed
  get pendingSquadron() {
    return this._pendingSquadron;
  }

  @action.bound
  setPendingSite(site: SiteModel) {
    this._pendingSite = site;
  }

  @action.bound
  setPendingSquadron(squadron: SquadronModel | null) {
    this._pendingSquadron = squadron;
  }

  @action.bound
  cancelPendingSite() {
    this._pendingSite = null;
  }

  @computed
  get dgsCoreSites() {
    return this._sites.filter(site => site.siteType === SiteType.DGSCoreSite);
  }

  @computed
  get dmsSites() {
    return this._sites.filter(site => site.siteType === SiteType.DMSSite);
  }

  @computed
  get guardSites() {
    return this._sites.filter(site => site.siteType === SiteType.GuardSite);
  }

  getSiteByName(name: string) {
    return this._sites.find(s => s.name === name)!;
  }
}