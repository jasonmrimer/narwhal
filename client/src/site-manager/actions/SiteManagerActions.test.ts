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
      setAddNewFlightPrompt: jest.fn(),
      getScheduleByScheduleId: (id: number) => schedule,
      setPendingScheduleStartDate: jest.fn(),
      addPendingNewFlight: jest.fn(),
      savePendingNewFlight: jest.fn(),
      setShiftPrompt: jest.fn(),
      refreshFlights: jest.fn(),
      cancelPendingNewFlight: jest.fn(),
      addFlightToExpandedFlights: jest.fn(),
      removeFlightFromExpandedFlights : jest.fn(),
      shouldExpandFlight : jest.fn(),
      hideSchedulePrompt: jest.fn(),
      deleteFlight: jest.fn()
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

    expect(siteManagerStore.setShiftPrompt)
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

  it('should add a new pending flight for creation', () => {
    subject.addNewFlight();
    expect(siteManagerStore.addPendingNewFlight).toHaveBeenCalled();
  });

  it('should save a new flight and refresh the flights', async () => {
    await subject.saveNewFlight();
    expect(siteManagerStore.savePendingNewFlight).toHaveBeenCalled();
    expect(siteManagerStore.refreshFlights).toHaveBeenCalled();
  });

  it('should cancel the addition of a new flight', () => {
    subject.cancelNewFlight();
    expect(siteManagerStore.cancelPendingNewFlight).toHaveBeenCalled();
  });

  it('should enable expand when a flight is expanded', () => {
    subject.expandFlight(1);
    expect(siteManagerStore.addFlightToExpandedFlights).toBeCalledWith(1);
  });

  it('should enable collapse when a flight is collapsed', () => {
    subject.collapseFlight(2);
    expect(siteManagerStore.removeFlightFromExpandedFlights).toBeCalledWith(2);
  });

  it('should delete and refresh Flight when Delete Flight is clicked', async () => {
    await subject.deleteFlight(4);
    expect(siteManagerStore.deleteFlight).toBeCalledWith(4);
    expect(siteManagerStore.refreshFlights).toBeCalled();
  });

  it('should show prompt when flight shift is changed', () => {
    subject.setFlightShift(1, ShiftType.Day);
    expect(siteManagerStore.setShiftPrompt).toHaveBeenCalledWith(1, ShiftType.Day);
  });
});