import MissionRepository from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import * as moment from 'moment';

export default class MissionRepositoryStub implements MissionRepository {
  findAll(): Promise<MissionModel[]> {
    return Promise.resolve([
      new MissionModel('missionId1', 'ato1', moment.utc('2018-01-01T01:00:00Z'), moment.utc('2018-01-01T11:00:00Z')),
      new MissionModel('missionId2', 'ato2', moment.utc('2018-02-02T02:00:00Z'), moment.utc('2018-02-02T14:00:00Z')),
      new MissionModel('missionId3', 'ato3', moment.utc('2018-03-03T03:00:00Z'), moment.utc('2018-03-04T03:00:00Z'))
    ]);
  }
}
