import { CrewModel } from '../models/CrewModel';

export interface CrewRepository {
  findOne(id: number): Promise<CrewModel>;
  update(crew: CrewModel): Promise<CrewModel>;
}