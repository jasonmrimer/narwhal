import { TabType } from '../tracker/stores/SidePanelStore';
import { stores } from '../stores';
import { AirmanModel } from '../airman/models/AirmanModel';

export class RosterActions {
  static openSidePanel = async (airman: AirmanModel, tabType: TabType) => {
    await stores.currencyStore.setRipItemsForAirman(airman.id);

    stores.currencyStore.closeSkillForm();
    stores.availabilityStore.closeEventForm();

    stores.sidePanelStore!.setSelectedTab(tabType);

    stores.trackerStore.setSelectedAirman(airman);
    stores.availabilityStore.setAirmanEvents(stores.trackerStore.selectedAirmanEvents);
  }
}