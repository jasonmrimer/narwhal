import { Stores } from '../stores';
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
    await crewStore!.save();
    await missionPlannerStore!.refreshAllEvents(locationFilterStore!.selectedSiteId);
  }

  submitAndPrint = async () => {
    await this.submit();
    (window as any).print();
  }

  addAirman = async (airman: AirmanModel) => {
    const {crewStore} = this.stores;
    if (crewStore!.crew!.hasAirman(airman)) {
      return;
    }
    crewStore!.setNewEntry({airmanName: `${airman.lastName}, ${airman.firstName}`});
    await this.submit();
  }
}
