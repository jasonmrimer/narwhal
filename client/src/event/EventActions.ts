import { FormStore } from '../widgets/stores/FormStore';
import { EventModel } from './models/EventModel';
import { TimeService } from '../tracker/services/TimeService';
import { Stores } from '../stores';

export class EventActions {
  constructor(private stores: Partial<Stores>, private timeSerivce: TimeService) {
  }

  handleFormSubmit = async (airmanId: number, formStore: FormStore<EventModel, any>) => {
    try {
      const event = formStore.stateToModel(airmanId);
      await this.stores.availabilityStore!.addEvent(event);

      const eventWeek = this.timeSerivce.navigateToWeek(event.startTime);

      this.stores.plannerStore!.setSidePanelWeek(eventWeek);

      await this.stores.availabilityStore!.refreshAirmanEvents(airmanId, eventWeek);

      await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerWeek);

      this.stores.availabilityStore!.closeEventForm();

      formStore.close();
    } catch (e) {
      formStore!.setErrors(e);
    }
  };

  handleDeleteEvent = (event: EventModel) => {
    this.stores.availabilityStore!.removeEvent(event);
  };

  executePendingDelete = async () => {
    const airmanId = this.stores.trackerStore!.selectedAirman.id;

    const event = await this.stores.availabilityStore!.executePendingDelete();

    const eventWeek = this.timeSerivce.navigateToWeek(event!.startTime);

    this.stores.plannerStore!.setSidePanelWeek(eventWeek);

    await this.stores.availabilityStore!.refreshAirmanEvents(airmanId, eventWeek);

    await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerWeek);

    this.stores.availabilityStore!.closeEventForm();
  };
}
