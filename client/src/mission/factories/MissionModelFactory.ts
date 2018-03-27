import * as moment from 'moment';
import { SiteModel } from '../../site/models/SiteModel';
import { MissionModel } from '../models/MissionModel';

const time = moment();

const missionOne = new MissionModel(
  1,
  'missionId1',
  'ato1',
  time,
  time,
  new SiteModel(1, 'DMS-GA', [])
);

const missionTwo = new MissionModel(
  2,
  'missionId2',
  'ato2',
  time,
  time,
  new SiteModel(1, 'DMS-GA', [])
);

const missionThree = new MissionModel(
  3,
  'missionId3',
  'ato3',
  time.clone().add(1, 'days'),
  time.clone().add(1, 'days'),
  new SiteModel(2, 'DMS-MD', [])
);

const missionFour = new MissionModel(
  4,
  'missionId4',
  'ato4',
  time.clone().add(2, 'days'),
  time.clone().add(2, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionFive = new MissionModel(
  5,
  'missionId5',
  'ato5',
  time.clone().add(4, 'days'),
  time.clone().add(4, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionSix = new MissionModel(
  6,
  'missionId6',
  'ato6',
  time.clone().add(8, 'days'),
  time.clone().add(8, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionSeven = new MissionModel(
  7,
  'missionId7',
  'ato7',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionEight = new MissionModel(
  8,
  'missionId8',
  'ato8',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionNine = new MissionModel(
  9,
  'missionId9',
  'ato9',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionTen = new MissionModel(
  10,
  'missionId10',
  'ato10',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionEleven = new MissionModel(
  11,
  'missionId11',
  'ato11',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionTwelve = new MissionModel(
  12,
  'missionId12',
  'ato12',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionThirteen = new MissionModel(
  13,
  'missionId13',
  'ato13',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionFourteen = new MissionModel(
  14,
  'missionId14',
  'ato14',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionFifteen = new MissionModel(
  15,
  'missionId15',
  'ato15',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionSixteen = new MissionModel(
  16,
  'missionId16',
  'ato16',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionSeventeen = new MissionModel(
  17,
  'missionId17',
  'ato17',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionEightteen = new MissionModel(
  18,
  'missionId18',
  'ato18',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionNineteen = new MissionModel(
  19,
  'missionId19',
  'ato19',
  time.clone().add(20, 'days'),
  time.clone().add(20, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missions = [
  missionOne,
  missionTwo,
  missionThree,
  missionFour,
  missionFive,
  missionSix,
  missionSeven,
  missionEight,
  missionNine,
  missionTen,
  missionEleven,
  missionTwelve,
  missionThirteen,
  missionFourteen,
  missionFifteen,
  missionSixteen,
  missionSeventeen,
  missionEightteen,
  missionNineteen
];

export class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static build() {
    return missionOne;
  }
}