import UnitRepository from '../UnitRepository';
import UnitModel from '../../models/UnitModel';

const units = [
  {id: 1, name: '1 U'},
  {id: 2, name: '2 U'}
];

export default class UnitRepositoryStub implements UnitRepository {
  findAll(): Promise<UnitModel[]> {
    return Promise.resolve(units);
  }
}