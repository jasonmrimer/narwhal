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