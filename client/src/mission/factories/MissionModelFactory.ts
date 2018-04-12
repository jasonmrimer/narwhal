import * as moment from 'moment';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { MissionModel } from '../models/MissionModel';

const time = moment();
const time4h = time.clone().add(4, 'hours');
const time1d = time.clone().add(1, 'days');
const time2d = time.clone().add(2, 'days');
const time4d = time.clone().add(4, 'days');
const time8d = time.clone().add(8, 'days');
const time20d = time.clone().add(20, 'days');

const siteOne = new SiteModel(1, 'DMS-GA', [], SiteType.DGSCoreSite, 'DMS Georgia');
const siteTwo = new SiteModel(2, 'DMS-MD', [], SiteType.DMSSite, 'DMS Maryland');
const siteThree = new SiteModel(3, 'DMS-HI', [], SiteType.GuardSite, 'DMS Hawaii');

const m1 = new MissionModel(1, 'missionId1', 'ato1', time, time4h, 'U-2', siteOne);
const m2 = new MissionModel(2, 'missionId2', 'ato2', time, time, 'U-2', siteOne);
const m3 = new MissionModel(3, 'missionId3', 'ato3', time1d, time1d, 'U-2', siteTwo);
const m4 = new MissionModel(4, 'missionId4', 'ato4', time2d, time2d, 'U-2', siteThree);
const m5 = new MissionModel(5, 'missionId5', 'ato5', time4d, time4d, 'U-2', siteThree);
const m6 = new MissionModel(6, 'missionId6', 'ato6', time8d, time8d, 'U-2', siteThree);
const m7 = new MissionModel(7, 'missionId7', 'ato7', time20d, time20d, 'U-2', siteThree);
const m8 = new MissionModel(8, 'missionId8', 'ato8', time20d, time20d, 'U-2', siteThree);
const m9 = new MissionModel(9, 'missionId9', 'ato9', time20d, time20d, 'U-2', siteThree);
const m10 = new MissionModel(10, 'missionId10', 'ato10', time20d, time20d, 'U-2', siteThree);
const m11 = new MissionModel(11, 'missionId11', 'ato11', time20d, time20d, 'U-2', siteThree);
const m12 = new MissionModel(12, 'missionId12', 'ato12', time20d, time20d, 'U-2', siteThree);
const m13 = new MissionModel(13, 'missionId13', 'ato13', time20d, time20d, 'Global Hawk', siteThree);
const m14 = new MissionModel(14, 'missionId14', 'ato14', time20d, time20d, 'Global Hawk', siteThree);
const m15 = new MissionModel(15, 'missionId15', 'ato15', time20d, time20d, 'Global Hawk', siteThree);
const m16 = new MissionModel(16, 'missionId16', 'ato16', time20d, time20d, 'Global Hawk', siteThree);
const m17 = new MissionModel(17, 'missionId17', 'ato17', time20d, time20d, 'Global Hawk', siteThree);
const m18 = new MissionModel(18, 'missionId18', 'ato18', time20d, time20d, 'Global Hawk', siteThree);
const m19 = new MissionModel(19, 'missionId19', 'ato19', time20d, time20d, 'Global Hawk');

const missions = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19];

export class MissionModelFactory {
  static buildList() {
    return missions;
  }

  static build() {
    return m1;
  }
}