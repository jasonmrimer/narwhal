import MissionRepository from '../MissionRepository';
import {MissionModel} from '../../models/MissionModel';

export default class MissionRepositoryStub implements MissionRepository {
  findAll(): Promise<MissionModel[]> {
    return Promise.resolve([new MissionModel('missionId1', 'ato1'),
      new MissionModel('missionId2', 'ato2'),
      new MissionModel('missionId3', 'ato3')]);
  }
}
