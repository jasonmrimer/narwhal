import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { MomentTimeService } from '../tracker/services/MomentTimeService';
import { CrewStore } from '../crew/stores/CrewStore';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { SkillFormStore } from '../skills/stores/SkillFormStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AppointmentFormStore } from '../event/stores/AppointmentFormStore';
import { AdminProfileStore } from '../admin/stores/AdminProfileStore';
import { LeaveFormStore } from '../event/stores/LeaveFormStore';
import { MissionPlannerStore } from '../crew/stores/MissionPlannerStore';
import { SidePanelStore } from '../tracker/stores/SidePanelStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { MissionFormStore } from '../event/stores/MissionFormStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { RosterHeaderStore } from '../roster/stores/RosterHeaderStore';
import { AirmanRipItemFormStore } from '../rip-item/stores/AirmanRipItemFormStore';
import { TDYDeploymentFormStore } from '../event/stores/TDYDeploymentFormStore';
import { WebRepositories } from '../utils/Repositories';
import { AirmanProfileManagerStore } from '../site-manager/stores/AirmanProfileManagerStore';
import { SiteManagerStore } from '../site-manager/stores/SiteManagerStore';
import { CertificationFormStore } from '../skills/certification/stores/CertificationFormStore';
import { SkillsFieldStore } from '../skills/stores/SkillsFieldStore';
import { PendingEventStore } from '../widgets/stores/PendingEventStore';
import { FlightAirmanSelectionStore } from '../site-manager/stores/FlightAirmanSelectionStore';
import { AdminSquadronStore } from '../admin/stores/AdminSquadronStore';

const timeService = new MomentTimeService();
const profileStore = new ProfileSitePickerStore(WebRepositories);

const locationFilterStore = new LocationFilterStore();
const rosterHeaderStore = new RosterHeaderStore();

const trackerStore = new TrackerStore(WebRepositories);
const plannerStore = new PlannerStore(timeService);
const sidePanelStore = new SidePanelStore();

const currencyStore = new CurrencyStore(WebRepositories);
const airmanRipItemFormStore = new AirmanRipItemFormStore(WebRepositories.ripItemRepository);
const skillFormStore = new SkillFormStore();
const skillsFieldStore = new SkillsFieldStore();

const availabilityStore = new AvailabilityStore(WebRepositories);
const appointmentFormStore = new AppointmentFormStore(timeService);
const leaveFormStore = new LeaveFormStore(timeService);
const missionFormStore = new MissionFormStore();
const tdyDeploymentFormStore = new TDYDeploymentFormStore(timeService);

const dashboardStore = new DashboardStore(WebRepositories);

const crewStore = new CrewStore(WebRepositories);
const missionPlannerStore = new MissionPlannerStore(WebRepositories);
const adminProfileStore = new AdminProfileStore(WebRepositories);
const adminSquadronStore = new AdminSquadronStore();
const airmanProfileManagerStore = new AirmanProfileManagerStore(WebRepositories.airmanRepository);
const flightAirmanSelectionStore = new FlightAirmanSelectionStore();
const siteManagerStore = new SiteManagerStore(WebRepositories);
const certificationFormStore = new CertificationFormStore();
const pendingEventStore = new PendingEventStore();

export interface Stores {
  profileStore: ProfileSitePickerStore;
  locationFilterStore: LocationFilterStore;
  rosterHeaderStore: RosterHeaderStore;
  trackerStore: TrackerStore;
  plannerStore: PlannerStore;
  sidePanelStore: SidePanelStore;
  currencyStore: CurrencyStore;
  airmanRipItemFormStore: AirmanRipItemFormStore;
  skillFormStore: SkillFormStore;
  skillsFieldStore: SkillsFieldStore;
  availabilityStore: AvailabilityStore;
  appointmentFormStore: AppointmentFormStore;
  leaveFormStore: LeaveFormStore;
  missionFormStore: MissionFormStore;
  tdyDeploymentFormStore: TDYDeploymentFormStore;
  dashboardStore: DashboardStore;
  crewStore: CrewStore;
  missionPlannerStore: MissionPlannerStore;
  adminProfileStore: AdminProfileStore;
  adminSquadronStore: AdminSquadronStore;
  airmanProfileManagerStore: AirmanProfileManagerStore;
  flightAirmanSelectionStore: FlightAirmanSelectionStore;
  siteManagerStore: SiteManagerStore;
  certificationFormStore: CertificationFormStore;
  pendingEventStore: PendingEventStore;
}

export const stores = {
  adminProfileStore,
  adminSquadronStore,
  airmanRipItemFormStore,
  appointmentFormStore,
  availabilityStore,
  crewStore,
  currencyStore,
  dashboardStore,
  leaveFormStore,
  locationFilterStore,
  missionFormStore,
  missionPlannerStore,
  plannerStore,
  profileStore,
  rosterHeaderStore,
  sidePanelStore,
  skillFormStore,
  skillsFieldStore,
  tdyDeploymentFormStore,
  trackerStore,
  airmanProfileManagerStore,
  flightAirmanSelectionStore,
  siteManagerStore,
  certificationFormStore,
  pendingEventStore,
};