import { MissionRepository } from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import { MissionModelFactory } from '../../factories/MissionModelFactory';

export class MissionRepositoryStub implements MissionRepository {
  findAll(): Promise<MissionModel[]> {
    return Promise.resolve(MissionModelFactory.buildList());
  }

  findPlatforms(siteId: number | null): Promise<string[]> {
    const missions = MissionModelFactory.buildList();
    let platforms: string[];
    if (siteId === -1 || siteId === null) {
      platforms = missions.map((mission) => mission.platform).filter((el, i, a) => i === a.indexOf(el));
    } else {
      platforms = missions
        .filter((mission) => {
          if (mission.site) {
            return mission.site!.id === siteId;
          }
          return false;
        })
        .map((mission) => mission.platform)
        .filter((el, i, a) => i === a.indexOf(el));
    }
    return Promise.resolve(platforms);
  }
}
