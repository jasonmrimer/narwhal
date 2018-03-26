import { TrackerStore } from './TrackerStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import * as moment from 'moment';
import { toJS } from 'mobx';
import { TimeServiceStub } from '../services/doubles/TimeServiceStub';
import { EventModel, EventType } from '../../event/models/EventModel';
import { SkillType } from '../../skills/models/SkillType';
import { TabType } from './SidePanelStore';
import { AirmanQualificationModel } from '../../airman/models/AirmanQualificationModel';
import { DoubleRepositories } from '../../Repositories';
import { FakeAirmanRepository } from '../../airman/repositories/doubles/FakeAirmanRepository';
import { EventRepositoryStub } from '../../event/repositories/doubles/EventRepositoryStub';

describe('TrackerStore', () => {
  const timeServiceStub = new TimeServiceStub();
  const airmanRepository = (DoubleRepositories.airmanRepository as FakeAirmanRepository);
  const eventRepository = (DoubleRepositories.eventRepository as EventRepositoryStub);

  let allAirmen: AirmanModel[];
  let subject: TrackerStore;

  beforeEach(async () => {
    allAirmen = await airmanRepository.findAll();
    subject = new TrackerStore(DoubleRepositories, timeServiceStub);
    await subject.hydrate();
  });

  it('returns a list of all airmen', async () => {
    expect(toJS(subject.airmen)).toEqual(allAirmen);
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

    it('should set selected Airman with a new event form for airman', () => {
      const airman = allAirmen[0];
      const date = moment.utc();
      subject.newEvent(airman, date);
      expect(subject.selectedAirman).toEqual(airman);
      expect(subject.availabilityStore.selectedDate).toEqual(date);
      expect(subject.availabilityStore.shouldShowEventForm).toBeTruthy();
      expect(subject.availabilityStore.shouldShowEventTypeSelection).toBeTruthy();
      expect(subject.sidePanelStore.selectedTab).toBe(TabType.AVAILABILITY);
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

  describe('skill', () => {
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

      const updatedAirman = (await airmanRepository.findAll())[0];
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

      const updatedAirman = (await airmanRepository.findAll())[0];
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

      let updatedAirman = (await airmanRepository.findAll())[0];
      const qualLength = updatedAirman.qualifications.length;
      const id = updatedAirman.qualifications.find((q: AirmanQualificationModel) => q.skillId === 100)!.id;

      await subject.removeSkill(Object.assign({}, skill, {id}));

      updatedAirman = (await airmanRepository.findAll())[0];
      expect(updatedAirman.qualifications.length).toBeLessThan(qualLength);
    });
  });

  it('should update airman shift', async () => {
    const airman = subject.airmen[0];
    airman.shift = ShiftType.Swing;

    await subject.updateAirmanShift(airman, ShiftType.Night);
    expect(subject.airmen[0].shift).toBe(ShiftType.Night);
  });

  it('should set loading until hydrate completes', async () => {
    subject = new TrackerStore(DoubleRepositories, timeServiceStub);

    subject.setLoading(true);

    await subject.hydrate();

    expect(subject.loading).toBeFalsy();
  });
});
