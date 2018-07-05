import { FormStore } from '../widgets/forms/FormStore';
import { EventApproval, EventApprovalRole, EventModel, EventType } from './models/EventModel';
import { TimeService } from '../tracker/services/TimeService';
import { Stores } from '../app/stores';

export class EventActions {
  constructor(private stores: Partial<Stores>, private timeService: TimeService) {
  }

  handleFormSubmit = async (airmanId: number, formStore: FormStore<EventModel, any>) => {
    try {
      const event = formStore.stateToModel(airmanId);

      if (event.type === EventType.Mission) {
        await this.stores.availabilityStore!.addMissionEvent(event);
      } else {
        await this.stores.availabilityStore!.addEvent(event);
      }

      const eventWeek = this.timeService.navigateToWeek(event.startTime);

      this.stores.plannerStore!.setSidePanelWeek(eventWeek);

      await this.stores.availabilityStore!.refreshAirmanEvents(airmanId, eventWeek);

      await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerTimeSpan);

      this.stores.availabilityStore!.closeEventForm();

      formStore.close();
    } catch (e) {
      formStore!.setErrors(e);
    }
  }

  handleDeleteEvent = (event: EventModel) => {
    this.stores.availabilityStore!.removeEvent(event);
  }

  executePendingDelete = async () => {
    const airmanId = this.stores.trackerStore!.selectedAirman.id;

    const event = await this.stores.availabilityStore!.executePendingDelete();

    const eventWeek = this.timeService.navigateToWeek(event!.startTime);

    this.stores.plannerStore!.setSidePanelWeek(eventWeek);

    await this.stores.availabilityStore!.refreshAirmanEvents(airmanId, eventWeek);

    await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerTimeSpan);

    this.stores.availabilityStore!.closeEventForm();
  }

  updateEventApproval = async (approvalChoice: EventApproval, approvalRole: EventApprovalRole) => {
    const event = await this.stores.availabilityStore!.updateEventApproval(approvalChoice, approvalRole);
    const eventWeek = this.timeService.navigateToWeek(event.startTime);

    await this.stores.availabilityStore!.refreshAirmanEvents(event.airmanId, eventWeek);
    await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerTimeSpan);

    this.stores.availabilityStore!.closeEventForm();
    this.stores.availabilityStore!.openEditEventForm(event);
  }
}
