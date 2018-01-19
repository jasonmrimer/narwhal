import { AirmanStore } from './AirmanStore';
import AirmanRepositoryStub from './repositories/doubles/AirmanRepositoryStub';
import { SquadronStore } from '../squadron/SquadronStore';
import SquadronRepositoryStub from '../squadron/repositories/doubles/SquadronRepositoryStub';
import { FlightStore } from '../flight/FlightStore';
import { CertificationStore } from './CertificationStore';
import CertificationRepositoryStub from './repositories/doubles/CertificationRepositoryStub';
import EventRepositoryStub from '../event/repositories/doubles/EventRepositoryStub';
import AirmanModelFactory from './factories/AirmanModelFactory';

describe('AirmanStore', () => {
  const squadronStore = new SquadronStore(new SquadronRepositoryStub());
  const airmanStore = new AirmanStore(
    new AirmanRepositoryStub(),
    squadronStore,
    new FlightStore(squadronStore),
    new CertificationStore(new CertificationRepositoryStub()),
    new EventRepositoryStub()
  );

  const airman = AirmanModelFactory.build(1);
  airmanStore.setAirman(airman);
  const event = airman.events[0];
  event.id = 1;

  it('should delete an airman\'s event', async () => {
    if (event.id) {
      await airmanStore.deleteEvent(event.id);
      expect(airmanStore.getSelectedAirman.events.length).toBe(0);
      expect(airmanStore.selectedAirmanEvents.length).toBe(0);
    }
  });
});