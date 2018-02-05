import TrackerStore from './TrackerStore';
import AirmanRepositoryStub from '../../airman/repositories/doubles/AirmanRepositoryStub';
import SiteRepositoryStub from '../../site/repositories/doubles/SiteRepositoryStub';
import AirmanModel from '../../airman/models/AirmanModel';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import EventRepositoryStub from '../../event/repositories/doubles/EventRepositoryStub';
import { toJS } from 'mobx';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import TimeServiceStub from '../services/doubles/TimeServiceStub';
import AirmanModelFactory from '../../airman/factories/AirmanModelFactory';
import { default as SkillRepositoryStub } from '../../skills/repositories/doubles/SkillRepositoryStub';
import QualificationModel from '../../skills/models/QualificationModel';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import AirmanCertificationModel from '../../airman/models/AirmanCertificationModel';
import CertificationModel from '../../skills/models/CertificationModel';

describe('TrackerStore', () => {
  const airmenRepository = new AirmanRepositoryStub();
  const siteRepository = new SiteRepositoryStub();
  const skillRepository = new SkillRepositoryStub();
  const eventRepository = new EventRepositoryStub();
  const timeServiceStub = new TimeServiceStub();
  let allAirmen: AirmanModel[];
  let subject: TrackerStore;

  beforeEach(async () => {
    allAirmen = await airmenRepository.findAll();
    subject = new TrackerStore(
      airmenRepository,
      siteRepository,
      skillRepository,
      eventRepository,
      timeServiceStub,
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

  it('returns a list of qualification options', () => {
    expect(subject.qualificationOptions).toEqual([
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
      expect(subject.squadronId).toBe(UnfilteredValue);
      expect(subject.flightId).toBe(UnfilteredValue);
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
      expect(subject.flightId).toBe(UnfilteredValue);
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

  describe('filtering by qualifications', () => {
    beforeEach(() => {
      subject.setQualificationIds([
        {value: 1, label: 'qualification 1'},
        {value: 2, label: 'qualification 2'}
      ]);
    });

    it('returns airmen with the selected qualifications', () => {
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.id)).toEqual([4, 10]);
    });
  });

  describe('events', () => {
    const event = new EventModel('Title', 'Description', moment.utc(), moment.utc(), 1, EventType.Mission);

    it('should add an event to an airman', async () => {
      const savedEvent = await subject.addEvent(event);
      expect(eventRepository.hasEvent(savedEvent)).toBeTruthy();
    });

    it('should edit an existing event on an airman', async () => {
      const savedEvent = await subject.addEvent(event);
      const eventCount = eventRepository.count;

      savedEvent.title = 'Changed Title';
      const updatedEvent = await subject.addEvent(savedEvent);

      expect(eventRepository.count).toBe(eventCount);
      expect(eventRepository.hasEvent(updatedEvent)).toBeTruthy();
    });

    describe('delete', async () => {

      it('should set pending delete event', async () => {
        const savedEvent = await subject.addEvent(event);
        expect(subject.pendingDeleteEvent).toBeNull();
        subject.setPendingDeleteEvent(savedEvent);
        expect(subject.pendingDeleteEvent).toEqual(savedEvent);
      });

      it('should cancel pending delete event', () => {
        subject.setPendingDeleteEvent(null);
        expect(subject.pendingDeleteEvent).toBeNull();
      });

      it('should delete an airman\'s event', async () => {
        const savedEvent = await subject.addEvent(event);
        subject.setPendingDeleteEvent(savedEvent);
        await subject.deleteEvent();
        expect(eventRepository.hasEvent(savedEvent)).toBeFalsy();
        expect(subject.pendingDeleteEvent).toBeNull();
      });
    });
  });

  describe('changing time', () => {
    it('will increment the planner week and change the side panel week', () => {
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-11-26T00:00:00.000Z'))).toBeTruthy();
      subject.incrementPlannerWeek();
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-12-03T00:00:00.000Z'))).toBeTruthy();
      expect(subject.sidePanelWeek[0].isSame(moment.utc('2017-12-03T00:00:00.000Z'))).toBeTruthy();
    });

    it('will increment the side panel week but not change the planner week', () => {
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-11-26T00:00:00.000Z'))).toBeTruthy();
      subject.incrementSidePanelWeek();
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-11-26T00:00:00.000Z'))).toBeTruthy();
      expect(subject.sidePanelWeek[0].isSame(moment.utc('2017-12-03T00:00:00.000Z'))).toBeTruthy();
    });

    it('will decrement the planner week', () => {
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-11-26T00:00:00.000Z'))).toBeTruthy();
      subject.decrementPlannerWeek();
      expect(subject.plannerWeek[0].isSame(moment.utc('2017-11-19T00:00:00.000Z'))).toBeTruthy();
    });
  });

  describe('selecting an airman', () => {
    it('clears the selected event', () => {
      subject.setSelectedEvent(new EventModel('', '', moment.utc(), moment.utc(), 1));
      subject.setSelectedAirman(AirmanModelFactory.build());
      expect(subject.selectedEvent).toBeNull();
    });

    it('resets the side panel week', () => {
      expect(subject.sidePanelWeek[0].isSame(subject.plannerWeek[0])).toBeTruthy();
      subject.incrementSidePanelWeek();
      expect(subject.sidePanelWeek[0].isSame(subject.plannerWeek[0])).toBeFalsy();

      subject.clearSelectedAirman();
      expect(subject.sidePanelWeek[0].isSame(subject.plannerWeek[0])).toBeTruthy();
    });
  });

  describe('skills', () => {
    it('should add a qualification to an airman', async () => {
      const airman = allAirmen[0];
      const qualification = new AirmanQualificationModel(
        airman.id,
        new QualificationModel(100, 'A', 'A'),
        moment.utc(),
        moment.utc()
      );
      const qualLength = airman.qualifications.length;
      await subject.addAirmanSkill(qualification);
      const updatedAirman = (await airmenRepository.findAll())[0];
      expect(updatedAirman.qualifications.length).toBeGreaterThan(qualLength);
    });

    it('should add a certification to an airman', async () => {
      const airman = allAirmen[0];
      const certification = new AirmanCertificationModel(
        airman.id,
        new CertificationModel(100, 'A'),
        moment.utc(),
        moment.utc()
      );
      const certLength = airman.certifications.length;
      await subject.addAirmanSkill(certification);
      const updatedAirman = (await airmenRepository.findAll())[0];
      expect(updatedAirman.certifications.length).toBeGreaterThan(certLength);
    });
  });
});