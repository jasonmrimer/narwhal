import { stores } from '../stores';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Moment } from 'moment';

export class PlannerActions {
  static weekSlider = async (direction: any) => {
    direction();
    await stores.trackerStore.refreshEvents(stores.plannerStore.plannerWeek);
    if (!stores.trackerStore.selectedAirman.isEmpty) {
      await stores.availabilityStore.refreshAirmanEvents(
        stores.trackerStore.selectedAirman.id,
        stores.plannerStore.sidePanelWeek
      );
    }
  }

  static openSidePanel = async (airman: AirmanModel, date: Moment) => {
    await stores.currencyStore.setRipItemsForAirman(airman.id);

    stores.sidePanelStore!.setSelectedTab(TabType.AVAILABILITY);

    stores.trackerStore!.setSelectedAirman(airman);

    stores.availabilityStore!.setSelectedDate(date);

    stores.availabilityStore!.showEventForm();
  }
}
