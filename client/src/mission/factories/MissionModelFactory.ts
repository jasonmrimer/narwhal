import * as moment from 'moment';
import { SiteModel } from '../../site/models/SiteModel';
import { MissionModel } from '../models/MissionModel';

const missionOne = new MissionModel(
  'missionId1',
  'ato1',
  moment('2018-01-01T01:00:00Z'),
  moment('2018-01-01T11:00:00Z'),
  new SiteModel(1, 'DMS-GA', [])
);

const missionTwo = new MissionModel(
  'missionId2',
  'ato2',
  moment('2018-02-02T02:00:00Z'),
  moment('2018-02-02T14:00:00Z'),
  new SiteModel(1, 'DMS-GA', [])
);

const missionThree = new MissionModel(
  'missionId3',
  'ato3',
  moment('2018-03-03T03:00:00Z'),
  moment('2018-03-04T03:00:00Z'),
  new SiteModel(2, 'DMS-MD', [])
);

const missions = [missionOne, missionTwo, missionThree];

export class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static buildForSite(siteId: number) {
    return missions.filter((mission) => mission.site != null ? mission.site.id === siteId : false);
  }

  static build() {
    return missionOne;
  }
}