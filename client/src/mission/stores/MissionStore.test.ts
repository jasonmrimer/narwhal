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
      {value: 1, label: `${subject.missions[0].displayDate} - ato1`},
      {value: 2, label: `${subject.missions[1].displayDate} - ato2`},
      {value: 3, label: `${subject.missions[2].displayDate} - ato3`},
      {value: 4, label: `${subject.missions[3].displayDate} - ato4`}
    ]);
  });
});