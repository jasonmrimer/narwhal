import UnitRepository from '../UnitRepository';
import UnitModel from '../../models/UnitModel';

const units = [
  {id: 1, name: '1 U'},
  {id: 2, name: '2 U'},
  {id: 3, name: '3 U'},
  {id: 4, name: '4 U'}
];

export default class UnitRepositoryStub implements UnitRepository {
  findAll(): Promise<UnitModel[]> {
    return Promise.resolve(units);
  }
}