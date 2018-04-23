import { stores } from '../stores';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Moment } from 'moment';

export class PlannerActions {
  static weekSlider = async (direction: any) => {
    await direction();
    await stores.trackerStore.refreshEvents(stores.plannerStore.plannerWeek);
    if (stores.trackerStore.selectedAirman) {
      await stores.availabilityStore.refreshAirmanEvents(
        stores.trackerStore.selectedAirman.id,
        stores.plannerStore.sidePanelWeek
      );
    }
  }

  static newEvent = async (airman: AirmanModel, date: Moment) => {
    await stores.trackerStore!.setSelectedAirman(airman);
    stores.sidePanelStore!.setSelectedTab(TabType.AVAILABILITY);
    stores.availabilityStore!.setSelectedDate(date);
    stores.availabilityStore!.showEventForm();
  }
}
