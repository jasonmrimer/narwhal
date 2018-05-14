import { SiteManagerStore } from './SiteManagerStore';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { FlightModel } from '../../flight/model/FlightModel';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../../airman/models/AirmanModel';

describe('SiteManagerStore', () => {
  let airman: AirmanModel;
  let flight1: FlightModel;
  let flight2: FlightModel;
  let squadron: SquadronModel;
  let subject: SiteManagerStore;

  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    airman.squadronId = 1;
    airman.flightId = 1;

    flight1 = new FlightModel(1, 'Flight 1');
    flight2 = new FlightModel(2, 'Flight 2');

    squadron = new SquadronModel(1, 'squad1', [flight1, flight2]);

    subject = new SiteManagerStore();
    await subject.hydrate(({siteName: 'SITE 14'} as ProfileModel), squadron, [airman]);
  });

  it('should provide the current site', () => {
    expect(subject.siteName).toBe('SITE 14');
  });

  it('should give the flights with their airmen', () => {
    expect(subject.squadron.flights.length).toBe(2);
    expect(subject.getAirmenByFlightId(1)).toContain(airman);
  });
});
