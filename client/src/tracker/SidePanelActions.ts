import { stores } from '../stores';
import { TabType } from './stores/SidePanelStore';

export class SidePanelActions {
  static closeSidePanel = () => {
    stores.trackerStore.clearSelectedAirman();
    stores.availabilityStore.closeEventForm();
    stores.currencyStore.closeSkillForm();
    stores.currencyStore.closeAirmanRipItemForm();
    stores.plannerStore.setSidePanelWeek(stores.plannerStore.plannerWeek);
  }

  static selectTab = (tabType: TabType) => {
    stores.availabilityStore.closeEventForm();
    stores.currencyStore.closeSkillForm();
    stores.currencyStore.closeAirmanRipItemForm();
    stores.sidePanelStore.setSelectedTab(tabType);
  }
}