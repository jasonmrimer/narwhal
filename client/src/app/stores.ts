import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { MomentTimeService } from '../tracker/services/MomentTimeService';
import { CrewStore } from '../crew/stores/CrewStore';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { SkillFormStore } from '../skills/stores/SkillFormStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AppointmentFormStore } from '../event/stores/AppointmentFormStore';
import { AdminStore } from '../admin/stores/AdminStore';
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

const availabilityStore = new AvailabilityStore(WebRepositories);
const appointmentFormStore = new AppointmentFormStore(timeService);
const leaveFormStore = new LeaveFormStore(timeService);
const missionFormStore = new MissionFormStore();
const tdyDeploymentFormStore = new TDYDeploymentFormStore(timeService);

const dashboardStore = new DashboardStore(WebRepositories);

const crewStore = new CrewStore(WebRepositories);
const missionPlannerStore = new MissionPlannerStore(WebRepositories);
const adminStore = new AdminStore(WebRepositories.profileRepository);
const airmanProfileManagerStore = new AirmanProfileManagerStore(WebRepositories.airmanRepository);
const siteManagerStore = new SiteManagerStore(WebRepositories);

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
  availabilityStore: AvailabilityStore;
  appointmentFormStore: AppointmentFormStore;
  leaveFormStore: LeaveFormStore;
  missionFormStore: MissionFormStore;
  tdyDeploymentFormStore: TDYDeploymentFormStore;
  dashboardStore: DashboardStore;
  crewStore: CrewStore;
  missionPlannerStore: MissionPlannerStore;
  adminStore: AdminStore;
  airmanProfileManagerStore: AirmanProfileManagerStore;
  siteManagerStore: SiteManagerStore;
}

export const stores = {
  adminStore,
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
  tdyDeploymentFormStore,
  trackerStore,
  airmanProfileManagerStore,
  siteManagerStore
};