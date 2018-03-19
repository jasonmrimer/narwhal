import { MissionRepository } from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import { MissionModelFactory } from '../../factories/MissionModelFactory';

export class MissionRepositoryStub implements MissionRepository {
  findAll(): Promise<MissionModel[]> {
    return Promise.resolve(MissionModelFactory.buildList());
  }
}
