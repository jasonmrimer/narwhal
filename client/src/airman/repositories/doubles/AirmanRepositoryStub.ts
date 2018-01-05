import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';

const airmen = [
  ...AirmanModelFactory.buildList(2, 1, 1),
  ...AirmanModelFactory.buildList(2, 1, 2),
  ...AirmanModelFactory.buildList(2, 2, 1),
  ...AirmanModelFactory.buildList(1, 2, 2),
  ...AirmanModelFactory.buildList(3, 3, 1)
];

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    return Promise.resolve(airmen);
  }

  findByUnit(id: number) {
    const airmenForUnit = airmen.filter(airman => {
      return airman.unit!.id === id;
    });
    return Promise.resolve(airmenForUnit);
  }

  findByCrew(id: number): Promise<AirmanModel[]> {
    const airmenForCrew = airmen.filter(airman => {
      return id in airman.crews.map(crew => crew.id);
    });
    return Promise.resolve(airmenForCrew);
  }
}