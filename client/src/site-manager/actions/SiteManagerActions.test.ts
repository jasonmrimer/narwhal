import { SiteManagerActions } from './SiteManagerActions';
import { ShiftType } from '../../airman/models/AirmanModel';

describe('SiteManagerActions', () => {
  it('should set the shift for a flight', async () => {
    const airmanRepository: any = {
      updateShiftByFlightId: jest.fn()
    };
    const siteManagerStore: any = {
      setAirmenShiftByFlightId: jest.fn()
    };
    const subject = new SiteManagerActions(
      {siteManagerStore} as any,
      {airmanRepository} as any
    );

    await subject.setFlightShift(1, ShiftType.Day);

    expect(airmanRepository.updateShiftByFlightId)
      .toHaveBeenCalledWith(1, ShiftType.Day);
    expect(siteManagerStore.setAirmenShiftByFlightId)
      .toHaveBeenCalledWith(1, ShiftType.Day);
  });
});