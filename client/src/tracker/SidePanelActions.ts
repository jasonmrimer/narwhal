import { TabType } from './stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Moment } from 'moment';
import { Stores } from '../app/stores';

export class SidePanelActions {
  constructor(private stores: Partial<Stores>) {
  }

  selectTab = (tabType: TabType) => {
    this.stores.availabilityStore!.closeEventForm();
    this.stores.currencyStore!.closeSkillForm();
    this.stores.currencyStore!.closeAirmanRipItemForm();
    this.stores.sidePanelStore!.setSelectedTab(tabType);
  }

  openSidePanel = async (airman: AirmanModel, tabType: TabType, date?: Moment) => {
    this.stores.trackerStore!.setSelectedAirman(airman);
    this.stores.sidePanelStore!.setSelectedTab(tabType);
    this.stores.plannerStore!.setSidePanelWeek(this.stores.plannerStore!.plannerWeek);

    this.stores.availabilityStore!.closeEventForm();
    this.stores.currencyStore!.closeSkillForm();
    this.stores.currencyStore!.closeAirmanRipItemForm();

    await this.stores.currencyStore!.setRipItemsForAirman(airman.id);
    this.stores.availabilityStore!.setAirmanEvents(this.stores.trackerStore!.getEventsByAirmanId(airman.id));

    if (date) {
      this.stores.availabilityStore!.setSelectedDate(date);
      this.stores.availabilityStore!.showEventForm();
    }
  }

  closeSidePanel = () => {
    this.stores.trackerStore!.clearSelectedAirman();
    this.stores.availabilityStore!.closeEventForm();
    this.stores.currencyStore!.closeSkillForm();
    this.stores.currencyStore!.closeAirmanRipItemForm();
    this.stores.plannerStore!.setSidePanelWeek(this.stores.plannerStore!.plannerWeek);
  }
}
