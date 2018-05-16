import { SiteManagerActions } from './SiteManagerActions';
import { ShiftType } from '../../airman/models/AirmanModel';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import * as moment from 'moment';

describe('SiteManagerActions', () => {
  let siteManagerStore: any;
  let airmanRepository: any;
  let subject: SiteManagerActions;
  let schedule: ScheduleModel;
  const airman = AirmanModelFactory.build();

  beforeEach(() => {
    schedule = new ScheduleModel(1, ScheduleType.NoSchedule);

    siteManagerStore = {
      performLoading: (fn: any) => {
        fn();
      },
      setAirmenShiftByFlightId: jest.fn(),
      setAirmenScheduleByFlightId: jest.fn(),
      getScheduleByScheduleId: (id: number) => schedule,
    };

    airmanRepository = {
      updateShiftByFlightId: jest.fn(),
      updateScheduleByFlightId: (flightId: number, s: ScheduleModel) => {
        airman.schedules.push(new AirmanScheduleModel(airman.id, s, moment()));
        return [airman];
      },
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

  it('should set the schedule for a flight', async () => {
    await subject.setFlightSchedule(1, 1);
    const foundSchedule = siteManagerStore.getScheduleByScheduleId(1);
    const airmen = airmanRepository.updateScheduleByFlightId(1, foundSchedule);

    expect(siteManagerStore.setAirmenScheduleByFlightId)
      .toHaveBeenCalledWith(1, airmen);
  });
});