import { SiteManagerActions } from './SiteManagerActions';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';

describe('SiteManagerActions', () => {
  let siteManagerStore: any;
  let airmanRepository: any;
  let subject: SiteManagerActions;
  let schedule: ScheduleModel;
  const airman = AirmanModelFactory.build();
  let airmen: AirmanModel[] = [airman];

  beforeEach(() => {
    schedule = new ScheduleModel(1, ScheduleType.NoSchedule);

    siteManagerStore = {
      performLoading: (fn: any) => {
        fn();
      },
      pendingScheduleId: 1,
      pendingFlightId: 1,
      setAirmenShiftByFlightId: jest.fn(),
      setAirmenScheduleByFlightId: jest.fn(),
      setSchedulePrompt: jest.fn(),
      updateScheduleByFlightId: jest.fn(),
      getScheduleByScheduleId: (id: number) => schedule,
      setPendingScheduleStartDate: jest.fn()
    };

    airmanRepository = {
      updateShiftByFlightId: jest.fn(),
      updateScheduleByFlightId: () => airmen,
    };

    subject = new SiteManagerActions(
      {siteManagerStore} as any,
      {airmanRepository} as any
    );
  });

  it('should set the shift for a flight', async () => {
    await subject.setFlightShift(1, ShiftType.Day);

    expect(airmanRepository.updateShiftByFlightId)
      .toHaveBeenCalledWith(1, ShiftType.Day);
    expect(siteManagerStore.setAirmenShiftByFlightId)
      .toHaveBeenCalledWith(1, ShiftType.Day);
  });

  it('should set the schedule for a flight',  () => {
    subject.setFlightSchedule(1, 1);
    expect(siteManagerStore.setSchedulePrompt).toBeCalledWith(1, 1);
  });

  it('should save a flight schedule', async () => {
    await subject.saveFlightSchedule();
    expect(siteManagerStore.setAirmenScheduleByFlightId).toHaveBeenCalledWith(1, airmen);
  });
});