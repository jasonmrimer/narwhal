import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';

const units = [
  {
    id: 1,
    airmen: [
      ...AirmanModelFactory.buildList(3, 1),
      ...AirmanModelFactory.buildList(3, 2)
    ]
  },
  {
    id: 2,
    airmen: [
      ...AirmanModelFactory.buildList(3, 3),
      ...AirmanModelFactory.buildList(3, 4)
    ]
  }
];

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    //TODO: use spread operator instead of concat. ES6 FTW
    const airmen = units.reduce((accum, unit) => accum.concat(unit.airmen), ([] as AirmanModel[]));
    return Promise.resolve(airmen);
  }

  findByUnit(id: number) {
    const airmenForUnit = units.reduce((accum, unit) => id === unit.id ? unit.airmen : accum, ([] as AirmanModel[]));
    return Promise.resolve(airmenForUnit);
  }

  findByFlight(id: number): Promise<AirmanModel[]> {
    const airmen = units.reduce((accum, unit) => accum.concat(unit.airmen), ([] as AirmanModel[]));
    const airmenForFlight = airmen.filter(airman => id === airman.flightId);
    return Promise.resolve(airmenForFlight);
  }
}