import { TrackerStore } from './TrackerStore';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { SiteRepositoryStub } from '../../site/repositories/doubles/SiteRepositoryStub';
import { AirmanModel } from '../../airman/models/AirmanModel';
import * as moment from 'moment';
import { EventRepositoryStub } from '../../event/repositories/doubles/EventRepositoryStub';
import { toJS } from 'mobx';
import { UnfilteredValue } from '../../widgets/models/FilterOptionModel';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { TimeServiceStub } from '../services/doubles/TimeServiceStub';
import { EventModel, EventType } from '../../event/models/EventModel';
import SkillRepositoryStub from '../../skills/repositories/doubles/SkillRepositoryStub';
import { SkillType } from '../../skills/models/SkillType';

describe('TrackerStore', () => {
  const airmenRepository = new FakeAirmanRepository();
  const siteRepository = new SiteRepositoryStub();
  const skillRepository = new SkillRepositoryStub();
  const eventRepository = new EventRepositoryStub();
  const missionRepository = new MissionRepositoryStub();
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
      missionRepository
    );
    await subject.hydrate();
  });

  it('returns a list of all airmen', async () => {
    expect(toJS(subject.airmen)).toEqual(allAirmen);
  });

  it('returns a list of site options', () => {
    expect(subject.siteOptions).toEqual([
      {value: 1, label: 'DMS-GA'},
      {value: 2, label: 'DMS-MD'},
      {value: 3, label: 'DMS-HI'}
    ]);
  });

  it('returns a list of qualification options', () => {
    expect(subject.qualificationOptions).toEqual([
      {value: 0, label: '0 - 0'},
      {value: 1, label: '1 - 1'},
      {value: 2, label: '2 - 2'},
      {value: 3, label: '3 - 3'},
      {value: 4, label: '4 - 4'},
      {value: 5, label: '5 - 5'},
      {value: 6, label: '6 - 6'},
      {value: 7, label: '7 - 7'},
      {value: 8, label: '8 - 8'},
      {value: 9, label: '9 - 9'}
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
    it('returns airmen for the site', () => {
      subject.setSiteId(1);
      const filteredAirmen = subject.airmen;
      expect(filteredAirmen.length).toBeLessThan(allAirmen.length);
      expect(filteredAirmen.map(airman => airman.flightId)
        .filter((el, i, a) => i === a.indexOf(el))).toEqual([1, 2, 3, 4]);
    });

    it('returns a list of squadron options for the site', () => {
      subject.setSiteId(1);
      expect(subject.squadronOptions).toEqual([
        {value: 1, label: 'Squad 1'},
        {value: 2, label: 'Squad 2'}
      ]);
    });

    it('resets squadron and flight when it sets a new site', () => {
      subject.setSiteId(1);
      subject.setSquadronId(2);
      subject.setFlightId(1);
      subject.setSiteId(2);
      expect(subject.squadronId).toBe(UnfilteredValue);
      expect(subject.flightId).toBe(UnfilteredValue);
    });

    it('keeps the squadron and flight when it sets the same site', () => {
      subject.setSiteId(1);
      subject.setSquadronId(2);
      subject.setFlightId(1);
      subject.setSiteId(1);
      expect(subject.squadronId).toBe(2);
      expect(subject.flightId).toBe(1);
    });

    describe('when a site only has one squadron', () => {
      it('sets the squadron id on selection', () => {
        subject.setSiteId(3);
        expect(subject.squadronId).toBe(5);
      });

      it('sets the squadron id on hydration', async () => {
        await subject.hydrate(3);
        expect(subject.squadronId).toBe(5);
      });
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

    it('resets the flight when a new squadron is set', () => {
      subject.setFlightId(1);
      subject.setSquadronId(2);
      expect(subject.flightId).toBe(UnfilteredValue);
    });

    it('keeps the flight when the same squadron is set', () => {
      subject.setFlightId(1);
      subject.setSquadronId(1);
      expect(subject.flightId).toBe(1);
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
    const event = new EventModel('Title', 'Description', moment(), moment(), 1, EventType.Mission);

    describe('addEvent', () => {
      it('should add an event to an airman', async () => {
        const savedEvent = await subject.addEvent(event);
        expect(eventRepository.hasItem(savedEvent)).toBeTruthy();
      });

      it('should call set form errors on Availability Stores when catching errors from add event', async () => {
        const invalidEvent = new EventModel('', 'Description', moment(), moment(), 1, EventType.Appointment);
        const setFormErrorsSpy = jest.fn();
        subject.availabilityStore.setFormErrors = setFormErrorsSpy;
        await subject.addEvent(invalidEvent);
        expect(setFormErrorsSpy).toHaveBeenCalledWith([{title: 'This field is required.'}]);
      });
    });

    it('should edit an existing event on an airman', async () => {
      const savedEvent = await subject.addEvent(event);
      const eventCount = eventRepository.count;

      savedEvent.title = 'Changed Title';
      const updatedEvent = await subject.addEvent(savedEvent);

      expect(eventRepository.count).toBe(eventCount);
      expect(eventRepository.hasItem(updatedEvent)).toBeTruthy();
    });

    describe('delete', () => {
      let savedEvent: EventModel;

      beforeEach(async () => {
        savedEvent = await subject.addEvent(event);
        expect(subject.pendingDeleteEvent).toBeNull();
        subject.removeEvent(savedEvent);
      });

      it('should set pending delete event', () => {
        expect(subject.pendingDeleteEvent).toEqual(savedEvent);
      });

      it('should cancel pending delete event', () => {
        subject.cancelPendingDelete();
        expect(subject.pendingDeleteEvent).toBeNull();
      });

      it('should delete an airman\'s event', async () => {
        await subject.executePendingDelete();
        expect(subject.pendingDeleteEvent).toBeNull();
        expect(eventRepository.hasItem(savedEvent)).toBeFalsy();
        expect(subject.availabilityStore.shouldShowEventForm).toBeFalsy();
      });
    });
  });

  describe('selecting an airman', () => {
    it('resets the side panel week', () => {
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeTruthy();
      subject.plannerStore.incrementSidePanelWeek();
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeFalsy();

      subject.clearSelectedAirman();
      expect(subject.plannerStore.sidePanelWeek[0].isSame(subject.plannerStore.plannerWeek[0])).toBeTruthy();
    });
  });

  describe('skills', () => {
    it('should add a qualification to an airman', async () => {
      const airman = allAirmen[0];
      const qualLength = airman.qualifications.length;

      await subject.addSkill({
        id: null,
        type: SkillType.Qualification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      });

      const updatedAirman = (await airmenRepository.findAll())[0];
      expect(updatedAirman.qualifications.length).toBeGreaterThan(qualLength);
    });

    it('should add a certification to an airman', async () => {
      const airman = allAirmen[0];
      const certLength = airman.certifications.length;

      await subject.addSkill({
        id: null,
        type: SkillType.Certification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      });

      const updatedAirman = (await airmenRepository.findAll())[0];
      expect(updatedAirman.certifications.length).toBeGreaterThan(certLength);
    });

    it('should delete a qualification from the airman', async () => {
      const airman = allAirmen[0];
      const skill = {
        id: null,
        type: SkillType.Qualification,
        airmanId: airman.id,
        skillId: 100,
        earnDate: moment(),
        expirationDate: moment()
      };

      await subject.addSkill(skill);

      let updatedAirman = (await airmenRepository.findAll())[0];
      const qualLength = updatedAirman.qualifications.length;
      const id = updatedAirman.qualifications.find(q => q.skillId === 100)!.id;

      await subject.removeSkill(Object.assign({}, skill, {id}));

      updatedAirman = (await airmenRepository.findAll())[0];
      expect(updatedAirman.qualifications.length).toBeLessThan(qualLength);
    });
  });

  it('should set the lastNameFilter', () => {
    const airman = subject.airmen[0];
    subject.setLastNameFilter({target: {value: airman.lastName}});

    expect(subject.airmen.length).toBe(1);
    expect(subject.airmen[0].firstName).toBe(airman.firstName);
  });
});
