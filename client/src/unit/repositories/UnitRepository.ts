import UnitModel from '../models/UnitModel';

export default interface UnitRepository {
  findAll(): Promise<UnitModel[]>;
}