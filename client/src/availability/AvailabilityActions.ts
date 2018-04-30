import { stores } from '../stores';
import { Moment } from 'moment';

export class AvailabilityActions {
  static decrementWeek = async () => {
    await stores.plannerStore.decrementSidePanelWeek();
    await stores.availabilityStore.refreshAirmanEvents(
      stores.trackerStore.selectedAirman.id,
      stores.plannerStore.sidePanelWeek
    );
  }

  static incrementWeek = async () => {
    await stores.plannerStore.incrementSidePanelWeek();
    await stores.availabilityStore.refreshAirmanEvents(
      stores.trackerStore.selectedAirman.id,
      stores.plannerStore.sidePanelWeek
    );
  }

  static openFormForDay = (day: Moment) => {
    stores.availabilityStore.setSelectedDate(day);
    stores.availabilityStore.showEventForm();
  }

  static openForm = () => {
    stores.availabilityStore.clearSelectedDate();
    stores.availabilityStore.showEventForm();
  }
}