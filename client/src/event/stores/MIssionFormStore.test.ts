import { EventModel, EventType } from '../models/EventModel';
import { EventModelFactory } from '../factories/EventModelFactory';
import { MissionFormStore } from './MissionFormStore';
import { MissionRepositoryStub } from '../../mission/repositories/doubles/MissionRepositoryStub';
import { MissionModel } from '../../mission/models/MissionModel';

describe('MissionFormStore', () => {
  const airmanId = 123;
  let missions: MissionModel[];
  let subject: MissionFormStore;
  let event: EventModel;

  beforeEach(async () => {
    event = EventModelFactory.build();
    event.type = EventType.Mission;

    missions = await new MissionRepositoryStub().findAll();

    subject = new MissionFormStore();
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
      expect(subject.errors).toEqual({});
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
      expect(subject.errors).toEqual({});
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
      expect(subject.errors).toEqual({});
      expect(subject.hasModel).toBeFalsy();
    });
  });

  it('can add an event', () => {
    const selectedMission = subject.missions[1];
    subject.setState('id', String(selectedMission.id));

    const expectedEvent = new EventModel(
      selectedMission.atoMissionNumber,
      '',
      selectedMission.startDateTime,
      selectedMission.endDateTime!,
      airmanId,
      EventType.Mission,
      selectedMission.id
    );

    const addedEvent = subject.stateToModel(airmanId);
    expect(addedEvent.id).toEqual(expectedEvent.id);
    // FIXME
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
    expect(subject.errors).toEqual({});

    subject.setState('id', '');
    subject.setState('title', '');
    expect(subject.state.id).toBe('');
    expect(subject.state.title).toBe('');
    expect(subject.state.startDate).toBe('');
    expect(subject.state.startTime).toBe('');
    expect(subject.state.endDate).toBe('');
    expect(subject.state.endTime).toBe('');
    expect(subject.errors).toEqual({});
    expect(subject.hasModel).toBeFalsy();
  });

  it('returns a list of mission options', () => {
    expect(subject.missionOptions).toEqual([
      {value: 1, label: `${subject.missions[0].displayDateZulu} - ato1`},
      {value: 2, label: `${subject.missions[1].displayDateZulu} - ato2`},
      {value: 3, label: `${subject.missions[2].displayDateZulu} - ato3`},
      {value: 4, label: `${subject.missions[3].displayDateZulu} - ato4`},
      {value: 5, label: `${subject.missions[4].displayDateZulu} - ato5`},
      {value: 6, label: `${subject.missions[5].displayDateZulu} - ato6`},
      {value: 7, label: `${subject.missions[6].displayDateZulu} - ato7`},
      {value: 8, label: `${subject.missions[7].displayDateZulu} - ato8`},
      {value: 9, label: `${subject.missions[8].displayDateZulu} - ato9`},
      {value: 10, label: `${subject.missions[9].displayDateZulu} - ato10`},
      {value: 11, label: `${subject.missions[10].displayDateZulu} - ato11`},
      {value: 12, label: `${subject.missions[11].displayDateZulu} - ato12`},
      {value: 13, label: `${subject.missions[12].displayDateZulu} - ato13`},
      {value: 14, label: `${subject.missions[13].displayDateZulu} - ato14`},
      {value: 15, label: `${subject.missions[14].displayDateZulu} - ato15`},
      {value: 16, label: `${subject.missions[15].displayDateZulu} - ato16`},
      {value: 17, label: `${subject.missions[16].displayDateZulu} - ato17`},
      {value: 18, label: `${subject.missions[17].displayDateZulu} - ato18`},
      {value: 19, label: `${subject.missions[18].displayDateZulu} - ato19`},
    ]);
  });
});
