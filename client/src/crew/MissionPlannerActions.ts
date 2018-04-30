import { stores } from '../stores';

export class MissionPlannerActions {
  static refreshAirman = async () => {
    const {missionPlannerStore, locationFilterStore} = stores;
    await missionPlannerStore!.refreshAllAirmen(locationFilterStore!.selectedSite);
  }

  static submit = async () => {
    const {missionPlannerStore, locationFilterStore, crewStore} = stores;
    await crewStore!.save();
    await missionPlannerStore!.refreshAllEvents(locationFilterStore!.selectedSite);
  }
}