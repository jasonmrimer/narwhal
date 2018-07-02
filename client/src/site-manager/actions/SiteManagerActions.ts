import { ShiftType } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { Stores } from '../../app/stores';

export class SiteManagerActions {
  private airmanRepository: AirmanRepository;

  constructor(private stores: Partial<Stores>, repositories: Partial<Repositories>) {
    this.airmanRepository = repositories.airmanRepository!;
  }

  async setFlightShift(flightId: number, shift: ShiftType) {
      const {siteManagerStore} = this.stores;

      siteManagerStore!.setShiftPrompt(flightId, shift);
      return Promise.resolve();
  }

  async saveFlightShift() {
    const {siteManagerStore, flightAirmanSelectionStore} = this.stores;
    const pendingFlightId = siteManagerStore!.pendingFlightId!;
    const selections = flightAirmanSelectionStore!.getSelections(
      siteManagerStore!.getAirmenByFlightId(pendingFlightId));

    const pendingShiftId = siteManagerStore!.pendingShift!;
    const flightAirmenIds = selections.map(a => a.model.id);

    await siteManagerStore!.performLoading(async () => {
      await this.airmanRepository.updateShiftByFlightId(pendingFlightId, pendingShiftId, flightAirmenIds);
      siteManagerStore!.setAirmenShiftByFlightId(
        pendingFlightId,
        pendingShiftId,
        flightAirmenIds
      );
      siteManagerStore!.hideShiftPrompt();
    });
  }

  async setFlightSchedule(flightId: number, scheduleId: number) {
    this.stores.siteManagerStore!.setSchedulePrompt(flightId, scheduleId);
  }

  async saveFlightSchedule() {
    const {siteManagerStore, flightAirmanSelectionStore} = this.stores;
    const flightId = siteManagerStore!.pendingFlightId!;
    const scheduleId = siteManagerStore!.pendingScheduleId;
    const schedule = siteManagerStore!.getScheduleByScheduleId(scheduleId!);

    if (!schedule) {
      return;
    }

    await siteManagerStore!.performLoading(async () => {
      const selections = flightAirmanSelectionStore!.getSelections(
        siteManagerStore!.getAirmenByFlightId(flightId));
      const updatedAirmen = await this.airmanRepository.updateScheduleByFlightId(
        flightId,
        schedule,
        selections.map(a => a.model.id),
        siteManagerStore!.pendingScheduleStartDate
      );
      siteManagerStore!.setAirmenScheduleByFlightId(flightId, updatedAirmen);
      siteManagerStore!.hideSchedulePrompt();
    });
  }

  setPendingScheduleStartDate(input: any) {
    this.stores.siteManagerStore!.setPendingScheduleStartDate(input);
  }

  addNewFlight() {
    this.stores.siteManagerStore!.addPendingNewFlight();
  }

  cancelNewFlight() {
    this.stores.siteManagerStore!.cancelPendingNewFlight();
  }

  // todo only refresh if flight saved
  async saveNewFlight() {
    await this.stores.siteManagerStore!.savePendingNewFlight();
    await this.stores.siteManagerStore!.refreshFlights();
  }

  expandFlight(flightId: number) {
    this.stores.siteManagerStore!.addFlightToExpandedFlights(flightId);
  }

  collapseFlight(flightId: number) {
    this.stores.siteManagerStore!.removeFlightFromExpandedFlights(flightId);
  }

  async deleteFlight(flightId: number) {
    await  this.stores.siteManagerStore!.deleteFlight(flightId);
    await this.stores.siteManagerStore!.refreshFlights();
  }
}