import { RankRepository } from '../RankRepository';
import { RankModel } from '../../models/RankModel';

export class RankRepositoryStub implements RankRepository {
  findAll(): Promise<RankModel[]> {
    return Promise.resolve(
      [
        new RankModel(1, 'rank1'),
        new RankModel(2, 'rank2'),
        new RankModel(3, 'rank3'),
        new RankModel(4, 'rank4'),
      ]
    );
  }
}
