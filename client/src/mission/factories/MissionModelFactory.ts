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

const missions = [missionOne, missionTwo, missionThree, missionFour];

export class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static build() {
    return missionOne;
  }
}