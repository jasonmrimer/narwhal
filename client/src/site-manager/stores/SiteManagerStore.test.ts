import { SiteManagerStore } from './SiteManagerStore';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { FlightModel } from '../../flight/model/FlightModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';

describe('SiteManagerStore', () => {
  let airmen: AirmanModel[];
  let flight1: FlightModel;
  let flight2: FlightModel;
  let squadron: SquadronModel;
  let subject: SiteManagerStore;

  beforeEach(async () => {
    airmen = AirmanModelFactory.buildList(3);
    airmen.forEach((airman, i) => {
      airman.squadronId = 1;
      airman.flightId = 1;
      airman.shift = (i % 2) === 0 ? ShiftType.Night : ShiftType.Day;

    });

    flight1 = new FlightModel(1, 'Flight 1');
    flight2 = new FlightModel(2, 'Flight 2');

    squadron = new SquadronModel(1, 'squad1', [ flight1, flight2 ]);

    subject = new SiteManagerStore();
    await subject.hydrate(({siteName: 'SITE 14'} as ProfileModel), squadron, airmen);
  });

  it('should provide the current site', () => {
    expect(subject.siteName)
      .toBe('SITE 14');
  });

  it('should give the flights with their airmen', () => {
    expect(subject.squadron.flights.length)
      .toBe(2);
    expect(subject.getAirmenByFlightId(1))
      .toEqual(airmen);
  });

  it('should get the shift for the flight based on the most commonly used shift', () => {
    expect(subject.getShiftByFlightId(1))
      .toBe(ShiftType.Night);
  });

  it('should set the airmen shift by flight', () => {
    subject.setAirmenShiftByFlightId(1, ShiftType.Swing);
    expect(subject.getShiftByFlightId(1))
      .toBe(ShiftType.Swing);
    expect(subject.getAirmenByFlightId(1).map(a => a.shift))
      .toEqual([ShiftType.Swing, ShiftType.Swing, ShiftType.Swing]);
  });
});
