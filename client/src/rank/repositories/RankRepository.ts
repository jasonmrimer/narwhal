import { RankModel } from '../models/RankModel';

export interface RankRepository {
  findAll(): Promise<RankModel[]>;
}
