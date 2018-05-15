import {TrackerStore} from './TrackerStore';
import {AirmanModel, ShiftType} from '../../airman/models/AirmanModel';
import {DoubleRepositories} from '../../utils/Repositories';
import {AirmanModelFactory} from '../../airman/factories/AirmanModelFactory';
import {EventModelFactory} from '../../event/factories/EventModelFactory';
import {EventModel, EventType} from '../../event/models/EventModel';
import {TimeServiceStub} from "../services/doubles/TimeServiceStub";

describe('TrackerStore', () => {
  const siteId = 14;

  let subject: TrackerStore;
  let airmen: AirmanModel[];
  let events: EventModel[];

  beforeEach(async () => {
    subject = new TrackerStore(DoubleRepositories);
    airmen = [
      AirmanModelFactory.build(1),
      AirmanModelFactory.build(2)
    ];

    events = [
      EventModelFactory.build()
    ];

    subject.hydrate(airmen, events, siteId);
  });

  it('returns a list of all airmen', async () => {
    expect(subject.airmen.length).toBe(2);
  });

  it('should return events for a given airman id', () => {
    expect(subject.getEventsByAirmanId(1)).toContain(events[0]);
  });

  it('setting the selectedAirman should set the selected airman property', () => {
    const airman = AirmanModelFactory.build();
    subject.setSelectedAirman(airman);
    expect(subject.selectedAirman).toBe(airman);
  });

  it('should update airman shift', async () => {
    const airman = subject.airmen[0];
    airman.shift = ShiftType.Swing;

    await subject.updateAirmanShift(airman, ShiftType.Night);
    expect(subject.airmen[0].shift).toBe(ShiftType.Night);
  });

  it('should update events, siteId, and airmen on refresh', async () => {
    const timeServiceStub = new TimeServiceStub();

    let newEvent = EventModelFactory.build('Fake Event',
      '',
      timeServiceStub.getCurrentWeek()[1],
      timeServiceStub.getCurrentWeek()[2],
      11,
      EventType.Appointment,
      null
    );

    newEvent = await DoubleRepositories.eventRepository.save(newEvent);
    await subject.refreshAllAirmen(1, timeServiceStub.getCurrentWeek());

    expect(subject.airmen.length).toBe(2);
    expect(subject.events[0]).toEqual(newEvent);
  });
});
