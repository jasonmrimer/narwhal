import { Moment } from 'moment';
import { Stores } from '../app/stores';
import { readerAbility } from '../app/abilities';
import { EventType } from '../event/models/EventModel';

export class AvailabilityActions {
  constructor(private stores: Partial<Stores>) {
  }

  incrementWeek = async () => {
    await this.stores.plannerStore!.incrementSidePanelWeek();
    await this.refreshAvailabilityEventData();
  }

  decrementWeek = async () => {
    await this.stores.plannerStore!.decrementSidePanelWeek();
    await this.refreshAvailabilityEventData();
  }

  openEventForm = () => {
    this.stores.availabilityStore!.clearSelectedDate();
    this.stores.availabilityStore!.showEventForm(this.stores.trackerStore!.selectedAirman.id);
  }

  openEventFormForDay = (day: Moment) => {
    this.stores.availabilityStore!.setSelectedDate(day);
    this.stores.availabilityStore!.showEventForm(this.stores.trackerStore!.selectedAirman.id);
  }

  radioOptions() {
    let options: string[];
    options = Object.keys(EventType).map(key => EventType[key]);
    if (this.stores.profileStore!.profile!.ability === readerAbility) {
      return [options[1], options[2]];
    } else {
      return options;
    }
  }

  async refreshAvailabilityEventData() {
    await this.stores.availabilityStore!.refreshAirmanEvents(
      this.stores.trackerStore!.selectedAirman.id,
      this.stores.plannerStore!.sidePanelWeek
    );
  }
}