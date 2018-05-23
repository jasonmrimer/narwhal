import { ShiftType } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { Stores } from '../../app/stores';
import { SiteManagerStore } from '../stores/SiteManagerStore';

export class SiteManagerActions {
  private siteManagerStore: SiteManagerStore;
  private airmanRepository: AirmanRepository;

  constructor(stores: Partial<Stores>, repositories: Partial<Repositories>) {
    this.siteManagerStore = stores.siteManagerStore!;
    this.airmanRepository = repositories.airmanRepository!;
  }

  async setFlightShift(flightId: number, shift: ShiftType) {
    await this.siteManagerStore.performLoading(async () => {
      await this.airmanRepository.updateShiftByFlightId(flightId, shift);
      this.siteManagerStore.setAirmenShiftByFlightId(flightId, shift);
    });
  }

  async setFlightSchedule(flightId: number, scheduleId: number) {
    this.siteManagerStore!.setSchedulePrompt(flightId, scheduleId);
  }

  async saveFlightSchedule() {
    const flightId = this.siteManagerStore!.pendingFlightId!;
    const scheduleId = this.siteManagerStore!.pendingScheduleId;
    const schedule = this.siteManagerStore.getScheduleByScheduleId(scheduleId!);

    if (!schedule) {
      return;
    }

    await this.siteManagerStore.performLoading(async () => {
     const updatedAirmen = await this.airmanRepository.updateScheduleByFlightId(
       flightId,
       schedule,
       this.siteManagerStore.pendingScheduleStartDate);
     this.siteManagerStore.setAirmenScheduleByFlightId(flightId, updatedAirmen);
     this.siteManagerStore.hideSchedulePrompt();
    });
  }

  setPendingScheduleStartDate(input: any) {
    this.siteManagerStore.setPendingScheduleStartDate(input);
  }
}