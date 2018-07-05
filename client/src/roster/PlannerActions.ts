import { Stores } from '../app/stores';

export class PlannerActions {
  constructor(private stores: Partial<Stores>) {
  }

  incrementDay = async () => {
    this.stores.plannerStore!.incrementPlannerTimeSpan();
    await this.refreshPlannerEventData();
  }

  decrementDay = async () => {
    this.stores.plannerStore!.decrementPlannerTimeSpan();
    await this.refreshPlannerEventData();
  }

  async refreshPlannerEventData() {
    await this.stores.trackerStore!.performLoading(async () => {
      await this.stores.trackerStore!.refreshEvents(this.stores.plannerStore!.plannerTimeSpan);
      if (!this.stores.trackerStore!.selectedAirman.isEmpty) {
        await this.stores.availabilityStore!.refreshAirmanEvents(
          this.stores.trackerStore!.selectedAirman.id,
          this.stores.plannerStore!.sidePanelWeek
        );
      }
    });
  }
}
