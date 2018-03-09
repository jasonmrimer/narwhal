import { MissionStore } from './MissionStore';
import { MissionRepositoryStub } from '../repositories/doubles/MissionRepositoryStub';

describe('MissionStore', () => {
  let subject: MissionStore;
  beforeEach(() => {
    subject = new MissionStore(new MissionRepositoryStub());
    subject.hydrate();
  });

  it('returns a list of mission options', () => {
    expect(subject.missionOptions).toEqual([
      {value: 'missionId2', label: 'ato2'},
      {value: 'missionId3', label: 'ato3'},
      {value: 'missionId4', label: 'ato4'},
      {value: 'missionId5', label: 'ato5'}
    ]);
  });
});