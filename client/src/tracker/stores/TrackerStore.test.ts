import TrackerStore from './TrackerStore';
import AirmanRepositoryStub from '../../airman/repositories/doubles/AirmanRepositoryStub';
import SiteRepositoryStub from '../../site/repositories/doubles/SiteRepositoryStub';
import AirmanModel from '../../airman/models/AirmanModel';
import CertificationRepositoryStub from '../../airman/repositories/doubles/CertificationRepositoryStub';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';
import EventRepositoryStub from '../../event/repositories/doubles/EventRepositoryStub';
import { toJS } from 'mobx';

describe('TrackerStore', () => {
  const airmenRepository = new AirmanRepositoryStub();
  const siteRepository = new SiteRepositoryStub();
  const certificationRepository = new CertificationRepositoryStub();
  const eventRepository = new EventRepositoryStub();
  let allAirmen: AirmanModel[];
  let subject: TrackerStore;

  beforeEach(async () => {
    allAirmen = await airmenRepository.findAll();
    subject = new TrackerStore(
      airmenRepository,
      siteRepository,
      certificationRepository,
      eventRepository
    );
    await subject.hydrate();
  });

  it('returns a list of all airmen', async () => {
    expect(toJS(subject.airmen)).toEqual(allAirmen);
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: 1, label: 'Site 1'},
      {value: 2, label: 'Site 2'}
    ]);
  });

  it('returns a list of certification options', () => {
    expect(subject.certificationOptions).toEqual([
      {value: 0, label: '0'},
      {value: 1, label: '1'},
      {value: 2, label: '2'},
      {value: 3, label: '3'},
      {value: 4, label: '4'},
      {value: 5, label: '5'},
      {value: 6, label: '6'},
      {value: 7, label: '7'},
      {value: 8, label: '8'},
      {value: 9, label: '9'}
    ]);
  });

  it('returns an empty list of squadron options', () => {
    expect(subject.squadronOptions).toEqual([]);
  });

  it('returns an empty list of flight options', () => {
    expect(subject.flightOptions).toEqual([]);
  });

  describe('filtering by site', () => {
    beforeEach(() => {
      subject.setSiteId(1);
    });

    it('returns airmen for the site', () => {
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.flightId)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1, 2, 3, 4]);
    });

    it('returns a list of squadron options for the site', () => {
      expect(subject.squadronOptions).toEqual([
        {value: 1, label: 'Squad 1'},
        {value: 2, label: 'Squad 2'}
      ]);
    });

    it('resets squadron and flight', () => {
      subject.setSquadronId(2);
      subject.setFlightId(1);
      subject.setSiteId(2);
      expect(subject.squadronId).toBe(-1);
      expect(subject.flightId).toBe(-1);
    });
  });

  describe('filtering by squadron', () => {
    beforeEach(() => {
      subject.setSiteId(1);
      subject.setSquadronId(1);
    });

    it('returns airmen for the site and squadron', () => {
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.flightId)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1, 2]);
    });

    it('returns a list of flight options for the site and squadron', () => {
      expect(subject.flightOptions).toEqual([
        {value: 1, label: 'Flight 1'},
        {value: 2, label: 'Flight 2'}
      ]);
    });

    it('resets the flight', () => {
      subject.setFlightId(1);
      subject.setSquadronId(2);
      expect(subject.flightId).toBe(-1);
    });
  });

  describe('filtering by flight', () => {
    beforeEach(() => {
      subject.setSiteId(1);
      subject.setSquadronId(1);
      subject.setFlightId(1);
    });

    it('returns airmen for the site, squadron, and flight', () => {
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([1, 2, 3]);
    });
  });

  describe('filtering by certifications', () => {
    beforeEach(() => {
      subject.setCertificationIds([
        {value: 1, label: 'Certification 1'},
        {value: 2, label: 'Certification 2'}
      ]);
    });

    it('returns airmen with the selected certifications', () => {
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([4, 10]);
    });
  });

  describe('events', () => {
    const event = new EventModel('Title', 'Description', moment.utc(), moment.utc(), 1);

    it('should add an event to an airman', async () => {
      const originalAirman = subject.airmen.find(airman => airman.id === 1)!;
      const originalEventCount = originalAirman.events.length;

      await subject.addEvent(event);

      const updatedAirman = subject.airmen.find(airman => airman.id === 1)!;
      expect(updatedAirman.events.length).toBeGreaterThan(originalEventCount);
      expect(updatedAirman.events).toContain(event);
    });


    it('should delete an airman\'s event', async () => {
      const savedEvent = await subject.addEvent(event);
      await subject.deleteEvent(savedEvent);
      expect(eventRepository.deletedEvents).toContain(savedEvent.id);
    });
  });
});