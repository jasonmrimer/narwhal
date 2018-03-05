import { EventActions } from './EventActions';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { MissionFormStore } from './MissionFormStore';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { MissionStore } from '../../mission/stores/MissionStore';

describe('MissionFormStore', () => {
  const airmanId = 123;
  let eventActions: EventActions;
  let missionStore: MissionStore;
  let subject: MissionFormStore;
  let event: EventModel;

  beforeEach(async () => {
    event = EventModelFactory.build();
    event.type = EventType.Mission;

    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };

    missionStore = new MissionStore(new MissionRepositoryStub());
    await missionStore.hydrate();

    subject = new MissionFormStore(eventActions, missionStore);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasItem).toBeFalsy();
      expect(subject.state.missionId).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasItem).toBeTruthy();
      expect(subject.state.missionId).toBe(event.title);
      expect(subject.state.startDate).toBe(event.startTime.format('YYYY-MM-DD'));
      expect(subject.state.startTime).toBe(event.startTime.format('HHmm'));
      expect(subject.state.endDate).toBe(event.endTime.format('YYYY-MM-DD'));
      expect(subject.state.endTime).toBe(event.endTime.format('HHmm'));
      expect(subject.errors.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should clear the state', () => {
      subject.open(event);
      expect(subject.hasItem).toBeTruthy();

      subject.close();
      expect(subject.state.missionId).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasItem).toBeFalsy();
    });
  });

  it('can add an event', () => {
    const selectedMission = missionStore.missions[0];
    subject.setState({missionId: selectedMission.missionId});

    subject.addItem(airmanId);

    const expectedEvent = new EventModel(
      selectedMission.missionId,
      '',
      selectedMission.startDateTime,
      selectedMission.endDateTime!,
      airmanId,
      EventType.Mission
    );

    const addedEvent = (eventActions.addEvent as jest.Mock).mock.calls[0][0];
    expect(addedEvent.title).toEqual(expectedEvent.title);
    expect(addedEvent.startTime.isSame(expectedEvent.startTime)).toBeTruthy();
    expect(addedEvent.endTime.isSame(expectedEvent.endTime)).toBeTruthy();
    expect(addedEvent.airmanId).toEqual(expectedEvent.airmanId);
    expect(addedEvent.type).toEqual(expectedEvent.type);
  });

  it('can clear the state', () => {
    const selectedMission = missionStore.missions[0];
    subject.setState({missionId: selectedMission.missionId, });
    expect(subject.state.missionId).toBe(selectedMission.missionId);
    expect(subject.state.startDate).toBe(selectedMission.startDateTime.format('YYYY-MM-DD'));
    expect(subject.state.startTime).toBe(selectedMission.startDateTime.format('HHmm'));
    expect(subject.state.endDate).toBe(selectedMission.endDateTime!.format('YYYY-MM-DD'));
    expect(subject.state.endTime).toBe(selectedMission.endDateTime!.format('HHmm'));
    expect(subject.errors.length).toBe(0);

    subject.setState({missionId: ''});
    expect(subject.state.missionId).toBe('');
    expect(subject.state.startDate).toBe('');
    expect(subject.state.startTime).toBe('');
    expect(subject.state.endDate).toBe('');
    expect(subject.state.endTime).toBe('');
    expect(subject.errors.length).toBe(0);
    expect(subject.hasItem).toBeFalsy();
  });

  it('can remove an event', () => {
    subject.open(event);

    subject.removeItem();

    expect(eventActions.removeEvent).toHaveBeenCalledWith(event);
  });
});
