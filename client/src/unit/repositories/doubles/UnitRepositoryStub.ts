import UnitRepository from '../UnitRepository';
import UnitModel from '../../models/UnitModel';
import UnitModelFactory from '../../factories/UnitModelFactory';

const units = [
  UnitModelFactory.build(1),
  UnitModelFactory.build(2)
];

export default class UnitRepositoryStub implements UnitRepository {
  findAll(): Promise<UnitModel[]> {
    return Promise.resolve(units);
  }
}