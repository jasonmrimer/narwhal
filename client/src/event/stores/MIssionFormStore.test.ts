import { EventActions } from './EventActions';
import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { MissionFormStore } from './MissionFormStore';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { MissionModel } from '../../mission/models/MissionModel';

describe('MissionFormStore', () => {
  const airmanId = 123;
  let eventActions: EventActions;
  let missions: MissionModel[];
  let subject: MissionFormStore;
  let event: EventModel;

  beforeEach(async () => {
    event = EventModelFactory.build();
    event.type = EventType.Mission;

    eventActions = {
      addEvent: jest.fn(),
      removeEvent: jest.fn()
    };

    missions = await new MissionRepositoryStub().findAll();

    subject = new MissionFormStore(eventActions);
    subject.hydrate(missions);
  });

  describe('open', () => {
    it('should have an empty state', () => {
      subject.open();
      expect(subject.hasModel).toBeFalsy();
      expect(subject.state.id).toBe('');
      expect(subject.state.title).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
    });

    it('should set the state with the given event', () => {
      subject.open(event);
      expect(subject.hasModel).toBeTruthy();
      expect(subject.state.id).toBe(String(event.id));
      expect(subject.state.title).toBe(event.title);
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
      expect(subject.hasModel).toBeTruthy();

      subject.close();
      expect(subject.state.id).toBe('');
      expect(subject.state.title).toBe('');
      expect(subject.state.startDate).toBe('');
      expect(subject.state.startTime).toBe('');
      expect(subject.state.endDate).toBe('');
      expect(subject.state.endTime).toBe('');
      expect(subject.errors.length).toBe(0);
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add an event', () => {
    const selectedMission = subject.missions[1];
    subject.setState('id', String(selectedMission.id));
    subject.addModel(airmanId);

    const expectedEvent = new EventModel(
      selectedMission.atoMissionNumber,
      '',
      selectedMission.startDateTime,
      selectedMission.endDateTime!,
      airmanId,
      EventType.Mission,
      selectedMission.id
    );

    const addedEvent = (eventActions.addEvent as jest.Mock).mock.calls[0][0];
    expect(addedEvent.title).toEqual(expectedEvent.title);
    expect(addedEvent.startTime.format('DD MMM YY HHmm')).toBe(expectedEvent.startTime.format('DD MMM YY HHmm'));
    expect(addedEvent.endTime.format('DD MMM YY HHmm')).toBe(expectedEvent.endTime.format('DD MMM YY HHmm'));
    expect(addedEvent.airmanId).toEqual(expectedEvent.airmanId);
    expect(addedEvent.type).toEqual(expectedEvent.type);
  });

  it('can clear the state', () => {
    const selectedMission = subject.missions[0];
    subject.setState('id', String(selectedMission.id));
    expect(subject.state.id).toBe(String(selectedMission.id));
    expect(subject.state.title).toBe(selectedMission.atoMissionNumber);
    expect(subject.state.startDate).toBe(selectedMission.startDateTime.format('YYYY-MM-DD'));
    expect(subject.state.startTime).toBe(selectedMission.startDateTime.format('HHmm'));
    expect(subject.state.endDate).toBe(selectedMission.endDateTime!.format('YYYY-MM-DD'));
    expect(subject.state.endTime).toBe(selectedMission.endDateTime!.format('HHmm'));
    expect(subject.errors.length).toBe(0);

    subject.setState('id', '');
    subject.setState('title', '');
    expect(subject.state.id).toBe('');
    expect(subject.state.title).toBe('');
    expect(subject.state.startDate).toBe('');
    expect(subject.state.startTime).toBe('');
    expect(subject.state.endDate).toBe('');
    expect(subject.state.endTime).toBe('');
    expect(subject.errors.length).toBe(0);
    expect(subject.hasModel).toBeFalsy();
  });

  it('can remove an event', () => {
    subject.open(event);

    subject.removeModel();

    expect(eventActions.removeEvent).toHaveBeenCalledWith(event);
  });

  it('returns a list of mission options', () => {
    expect(subject.missionOptions).toEqual([
      {value: 1, label: `${subject.missions[0].displayDate} - ato1`},
      {value: 2, label: `${subject.missions[1].displayDate} - ato2`},
      {value: 3, label: `${subject.missions[2].displayDate} - ato3`},
      {value: 4, label: `${subject.missions[3].displayDate} - ato4`},
      {value: 5, label: `${subject.missions[4].displayDate} - ato5`},
      {value: 6, label: `${subject.missions[5].displayDate} - ato6`},
      {value: 7, label: `${subject.missions[6].displayDate} - ato7`},
      {value: 8, label: `${subject.missions[7].displayDate} - ato8`},
      {value: 9, label: `${subject.missions[8].displayDate} - ato9`},
      {value: 10, label: `${subject.missions[9].displayDate} - ato10`},
      {value: 11, label: `${subject.missions[10].displayDate} - ato11`},
      {value: 12, label: `${subject.missions[11].displayDate} - ato12`},
      {value: 13, label: `${subject.missions[12].displayDate} - ato13`},
      {value: 14, label: `${subject.missions[13].displayDate} - ato14`},
      {value: 15, label: `${subject.missions[14].displayDate} - ato15`},
      {value: 16, label: `${subject.missions[15].displayDate} - ato16`},
      {value: 17, label: `${subject.missions[16].displayDate} - ato17`},
      {value: 18, label: `${subject.missions[17].displayDate} - ato18`},
      {value: 19, label: `${subject.missions[18].displayDate} - ato19`},
    ]);
  });
});
