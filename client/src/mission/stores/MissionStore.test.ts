import { MissionStore } from './MissionStore';
import { MissionRepositoryStub } from '../repositories/doubles/MissionRepositoryStub';

describe('MissionStore', () => {
  let subject: MissionStore;

  beforeEach(async () => {
    subject = new MissionStore(new MissionRepositoryStub());
    await subject.hydrate();
  });

  it('returns a list of mission options', () => {
    expect(subject.missionOptions).toEqual([
      {value: 'missionId1', label: 'ato1', date: subject.missions[0].startDateTime},
      {value: 'missionId2', label: 'ato2', date: subject.missions[1].startDateTime},
      {value: 'missionId3', label: 'ato3', date: subject.missions[2].startDateTime},
      {value: 'missionId4', label: 'ato4', date: subject.missions[3].startDateTime}
    ]);
  });
});