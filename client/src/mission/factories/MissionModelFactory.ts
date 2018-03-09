import * as moment from 'moment';
import { SiteModel } from '../../site/models/SiteModel';
import { MissionModel } from '../models/MissionModel';

const time = moment();

const missionOne = new MissionModel(
  'missionId1',
  'ato1',
  time.subtract(2, 'days'),
  time.subtract(2, 'days'),
  new SiteModel(1, 'DMS-GA', [])
);

const missionTwo = new MissionModel(
  'missionId2',
  'ato2',
  time,
  time,
  new SiteModel(1, 'DMS-GA', [])
);

const missionThree = new MissionModel(
  'missionId3',
  'ato3',
  time.add(1, 'days'),
  time.add(1, 'days'),
  new SiteModel(2, 'DMS-MD', [])
);

const missionFour = new MissionModel(
  'missionId4',
  'ato4',
  time.add(2, 'days'),
  time.add(2, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missionFive = new MissionModel(
  'missionId5',
  'ato5',
  time.add(2, 'days'),
  time.add(2, 'days'),
  new SiteModel(3, 'DMS-HI', [])
);

const missions = [missionOne, missionTwo, missionThree];
const missionList = [missionTwo, missionThree, missionFour, missionFive];

export class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static buildForSite(siteId: number) {
    return missions.filter((mission) => mission.site != null ? mission.site.id === siteId : false);
  }

  static buildForAllFromTodayOn() {
    return missionList;
  }

  static build() {
    return missionOne;
  }
}