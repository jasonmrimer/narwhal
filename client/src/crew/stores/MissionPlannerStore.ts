import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { AllEventsRefresher, CrewStore } from './CrewStore';
import { RosterHeaderStore, SiteIdContainer } from '../../roster/stores/RosterHeaderStore';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { AllAirmenRefresher, LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { CrewRepository } from '../repositories/CrewRepository';
import { EventRepository } from '../../event/repositories/EventRepository';
import { EventModel } from '../../event/models/EventModel';
import { CrewModel } from '../models/CrewModel';

export class MissionPlannerStore implements AllAirmenRefresher, SiteIdContainer, AllEventsRefresher {
  public crewStore: CrewStore;
  public rosterHeaderStore: RosterHeaderStore;
  public locationFilterStore: LocationFilterStore;

  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _events: EventModel[] = [];
  private _crew: CrewModel | null = null;

  private airmanRepository: AirmanRepository;
  private skillRepository: SkillRepository;
  private siteRepository: SiteRepository;
  private crewRepository: CrewRepository;
  private eventRepository: EventRepository;

  constructor(repositories: Repositories, private _profileStore: ProfileSitePickerStore) {
    this.airmanRepository = repositories.airmanRepository;
    this.skillRepository = repositories.skillRepository;
    this.siteRepository = repositories.siteRepository;
    this.crewRepository = repositories.crewRepository;
    this.eventRepository = repositories.eventRepository;

    this.rosterHeaderStore = new RosterHeaderStore(this);
    this.locationFilterStore = new LocationFilterStore(this);
    this.crewStore = new CrewStore(repositories, this);
  }

  @action.bound
  async hydrate(crewId: number) {
    this._loading = true;

    const [qualifications, certifications, sites, crew, airmen] = await Promise.all([
      this.skillRepository.findAllQualifications(),
      this.skillRepository.findAllCertifications(),
      this.siteRepository.findAll(),
      this.crewRepository.findOne(crewId),
      this.airmanRepository.findBySiteId(this.selectedSite)
    ]);

    this._crew = crew;
    this._airmen = airmen;

    await this.refreshAllEvents();

    this.rosterHeaderStore.hydrate(certifications, qualifications);
    this.locationFilterStore.hydrate(this.selectedSite, sites);
    this.crewStore.hydrate(crew, airmen);

    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get availableAirmen() {
    const busyAirmen = this.getIdsForBusyAirmen();
    let airmen = this._airmen.filter(airman => !busyAirmen.includes(airman.id));
    return this.applyFilters(airmen);
  }

  @computed
  get unavailableAirmen() {
    const busyAirmen = this.getIdsForBusyAirmen();
    let airmen = this._airmen.filter(airman => busyAirmen.includes(airman.id));
    return this.applyFilters(airmen);
  }

  get selectedSite() {
    return this._profileStore.profile!.siteId!;
  }

  async refreshAllAirmen() {
    this._airmen = await this.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
  }

  async refreshAllEvents() {
    this._events = await this.eventRepository.findAllBySiteIdAndWithinPeriod(
      this.selectedSite,
      this._crew!.mission.startDateTime,
      this._crew!.mission.endDateTime || this._crew!.mission.startDateTime.clone().add(12, 'hours')
    );
  }

  private getIdsForBusyAirmen() {
    return this._events
      .map(event => event.airmanId)
      .filter((id, index, array) => index === array.indexOf(id));
  }

  private applyFilters(airmen: AirmanModel[]) {
    const filteredAirmen = this.locationFilterStore.filterAirmen(airmen);
    return this.rosterHeaderStore.filterAirmen(filteredAirmen);
  }
}
