import { Stores } from '../app/stores';

export class PlannerActions {
  constructor(private stores: Partial<Stores>) {
  }

  incrementDay = async () => {
    this.stores.plannerStore!.incrementPlannerTimeSpan();
    await this.refreshEventData();
  }

  decrementDay = async () => {
    this.stores.plannerStore!.decrementPlannerTimeSpan();
    await this.refreshEventData();
  }

  private async refreshEventData() {
    await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerTimeSpan);
    if (!this.stores.trackerStore!.selectedAirman.isEmpty) {
      await this.stores.availabilityStore!.refreshAirmanEvents(
        this.stores.trackerStore!.selectedAirman.id,
        this.stores.plannerStore!.sidePanelWeek
      );
    }
  }
}
