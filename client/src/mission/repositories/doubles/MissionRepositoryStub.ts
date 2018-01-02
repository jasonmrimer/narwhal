import MissionRepository from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import MissionModelFactory from '../../factories/MissionModelFactory';

export default class MissionRepositoryStub implements MissionRepository {
  findAll(): Promise<MissionModel[]> {
    return Promise.resolve(MissionModelFactory.buildList());
  }

  findBySite(id: number): Promise<MissionModel[]> {
    return Promise.resolve(MissionModelFactory.buildForSite(id));
  }
}
