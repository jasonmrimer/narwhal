import { FormStore } from '../widgets/stores/FormStore';
import { EventModel } from './models/EventModel';
import { stores } from '../stores';

export class EventActions {
  static handleFormSubmit = async (airmanId: number, formStore: FormStore<EventModel, any>) => {
    try {
      const event = formStore.addModel(airmanId);
      await stores.plannerStore.navigateToWeek(event.startTime);
      await stores.availabilityStore.addEvent(event);
      await stores.trackerStore.refreshEvents(stores.tdyDeploymentFormStore!.week);
      await stores.plannerStore.setSidePanelWeek(stores.tdyDeploymentFormStore!.week);
      stores.availabilityStore.setAirmanEvents(stores.trackerStore!.getEventsByAirmanId(airmanId));
      stores.availabilityStore.closeEventForm();
      formStore.close();
    } catch (e) {
      formStore.setErrors(e);
    }
  }

  static handleDeleteEvent = async (event: EventModel) => {
    stores.availabilityStore.removeEvent(event);
  }

  static executePendingDeleteEvent = async (airmanId: number) => {
    await stores.availabilityStore.executePendingDelete();
    await stores.trackerStore.refreshEvents(stores.tdyDeploymentFormStore!.week);
    await stores.plannerStore.setSidePanelWeek(stores.tdyDeploymentFormStore!.week);
    stores.availabilityStore.setAirmanEvents(stores.trackerStore!.getEventsByAirmanId(airmanId));
    stores.availabilityStore.closeEventForm();
  }
}
