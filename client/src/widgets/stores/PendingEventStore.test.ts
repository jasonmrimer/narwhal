import { AirmanModel } from '../../airman/models/AirmanModel';
import { EventModel } from '../../event/models/EventModel';
import { SiteModel } from '../../site/models/SiteModel';
import { DoubleRepositories } from '../../utils/Repositories';
import { PendingEventStore } from './PendingEventStore';

describe('PendingEventStore', () => {
  let subject: PendingEventStore;
  let airmen: AirmanModel[];
  let events: EventModel[];
  let site: SiteModel;

  beforeEach(async () => {
    airmen = await DoubleRepositories.airmanRepository.findBySiteId(14);
    events = await DoubleRepositories.eventRepository.findAllPendingEventsBySiteId(14);
    site = await DoubleRepositories.siteRepository.findOne(14);
    subject = new PendingEventStore();

    subject.hydrate(airmen, events, site);
  });

  it('should hydrate the airmen, events, and site', () => {
    expect(subject.airmen.length).toBe(airmen.length);
    expect(subject.events.length).toBe(events.length);
    expect(subject.site.id).toBe(site.id);
  });

  it('should return AirmanModel from the associated airmanId', () => {
    expect(subject.findAirman(1).id).toEqual(airmen[0].id);
  });
});