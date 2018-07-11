import { Stores } from '../app/stores';
import { AirmanModel } from '../airman/models/AirmanModel';

export class MissionPlannerActions {
  constructor(private stores: Partial<Stores>) {
  }

  refreshAirman = async () => {
    const {missionPlannerStore, locationFilterStore} = this.stores;
    await missionPlannerStore!.refreshAllAirmen(locationFilterStore!.selectedSiteId);
  }

  submit = async () => {
    const {missionPlannerStore, locationFilterStore, crewStore} = this.stores;
    await missionPlannerStore!.performLoading(async () => {
      await crewStore!.save();
      await missionPlannerStore!.refreshAllEvents(locationFilterStore!.selectedSiteId);
    });
  }

  submitAndPrint = async () => {
    const {missionPlannerStore} = this.stores;
    await missionPlannerStore!.performLoading(async () => {
      await this.submit();
      (window as any).print();
    });
  }

  addAirman = async (airman: AirmanModel) => {
    const {crewStore, missionPlannerStore} = this.stores;
    if (crewStore!.hasAirman(airman)) {
      return;
    }
    await missionPlannerStore!.performLoading(async () => {
      crewStore!.setNewEntry({airmanName: `${airman.lastName}, ${airman.firstName}`});
      await this.submit();
    });
  }
}
