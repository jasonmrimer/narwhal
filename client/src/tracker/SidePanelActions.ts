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

  openSidePanel = async (airman: AirmanModel, tabType: TabType, date?: Moment, hideEventForm: boolean = false) => {
    await this.stores.trackerStore!.performLoading(async () => {
      this.stores.trackerStore!.setSelectedAirman(airman);
      this.stores.sidePanelStore!.setSelectedTab(tabType);

      this.stores.plannerStore!.setSidePanelWeek(
        this.stores.plannerStore!.plannerWeek,
        date === undefined ? null : date);

      this.stores.availabilityStore!.closeEventForm();
      this.stores.currencyStore!.closeSkillForm();
      this.stores.currencyStore!.closeAirmanRipItemForm();

      await this.stores.currencyStore!.setRipItemsForAirman(airman.id);
      this.stores.availabilityStore!.setAirmanEvents(this.stores.trackerStore!.getEventsByAirmanId(airman.id));

      await this.stores.availabilityStore!.refreshAirmanEvents(
        this.stores.trackerStore!.selectedAirman.id,
        this.stores.plannerStore!.sidePanelWeek
      );

      if (date && !hideEventForm) {
        this.stores.availabilityStore!.setSelectedDate(date);
        this.stores.availabilityStore!.showEventForm(airman.id);
      }
    });
  }

  closeSidePanel = () => {
    this.stores.trackerStore!.clearSelectedAirman();
    this.stores.availabilityStore!.closeEventForm();
    this.stores.currencyStore!.closeSkillForm();
    this.stores.currencyStore!.closeAirmanRipItemForm();
    this.stores.plannerStore!.setSidePanelWeek(this.stores.plannerStore!.plannerWeek);
  }

  openFromPendingEvent = async (airman: AirmanModel, tabType: TabType, date: Moment, history: any) => {
    await this.stores.trackerStore!.performLoading(async () => {
      this.stores.plannerStore!.navigateToPlannerWeek(date);
      await this.openSidePanel(airman, TabType.AVAILABILITY);

      history.replace('/');
      this.stores.pendingEventStore!.setShowList();
    });
  }
}