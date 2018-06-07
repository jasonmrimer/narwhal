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

    await siteManagerStore!.performLoading(async () => {
      await this.airmanRepository.updateShiftByFlightId(flightId, shift);
      siteManagerStore!.setAirmenShiftByFlightId(flightId, shift);
    });
  }

  async setFlightSchedule(flightId: number, scheduleId: number) {
    this.stores.siteManagerStore!.setSchedulePrompt(flightId, scheduleId);
  }

  async saveFlightSchedule() {
    const {siteManagerStore} = this.stores;
    const flightId = siteManagerStore!.pendingFlightId!;
    const scheduleId = siteManagerStore!.pendingScheduleId;
    const schedule = siteManagerStore!.getScheduleByScheduleId(scheduleId!);

    if (!schedule) {
      return;
    }

    await siteManagerStore!.performLoading(async () => {
      const updatedAirmen = await this.airmanRepository.updateScheduleByFlightId(
        flightId,
        schedule,
        siteManagerStore!.pendingScheduleStartDate);
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

  async saveNewFlight() {
    this.stores.siteManagerStore!.performLoading(async () => {
      await this.stores.siteManagerStore!.savePendingNewFlight();
      await this.stores.siteManagerStore!.refreshFlights();
    });
  }
}