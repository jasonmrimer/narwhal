import { Moment } from 'moment';
import { Stores } from '../stores';

export class AvailabilityActions {
  constructor(private stores: Partial<Stores>) {
  }

  incrementWeek = async () => {
    await this.stores.plannerStore!.incrementSidePanelWeek();
    await this.stores.availabilityStore!.refreshAirmanEvents(
      this.stores.trackerStore!.selectedAirman.id,
      this.stores.plannerStore!.sidePanelWeek
    );
  }

  decrementWeek = async () => {
    await this.stores.plannerStore!.decrementSidePanelWeek();
    await this.stores.availabilityStore!.refreshAirmanEvents(
      this.stores.trackerStore!.selectedAirman.id,
      this.stores.plannerStore!.sidePanelWeek
    );
  }

  openEventForm = () => {
    this.stores.availabilityStore!.clearSelectedDate();
    this.stores.availabilityStore!.showEventForm();
  }

  openEventFormForDay = (day: Moment) => {
    this.stores.availabilityStore!.setSelectedDate(day);
    this.stores.availabilityStore!.showEventForm();
  }
}