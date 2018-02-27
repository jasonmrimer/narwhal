import { CrewModel } from '../models/CrewModel';

export interface CrewRepository {
  findOne(id: number): Promise<CrewModel>;

  save(crew: CrewModel): Promise<CrewModel>;
}