export class PlannerActions {
  constructor(private stores: any) {
  }

  incrementDay = async () => {
    this.stores.plannerStore.incrementPlannerWeek();
    this.refreshEventData();
  }

  decrementDay = async () => {
    this.stores.plannerStore.decrementPlannerWeek();
    this.refreshEventData();
  }

  private async refreshEventData() {
    await this.stores.trackerStore.refreshEvents(this.stores.plannerStore.plannerWeek);
    if (!this.stores.trackerStore.selectedAirman.isEmpty) {
      await this.stores.availabilityStore.refreshAirmanEvents(
        this.stores.trackerStore.selectedAirman.id,
        this.stores.plannerStore.sidePanelWeek
      );
    }
  }
}
