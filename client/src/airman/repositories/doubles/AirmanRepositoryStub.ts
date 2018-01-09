import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';

const squadrons = [
  {
    id: 1,
    airmen: [
      AirmanModelFactory.build(1, 1),
      AirmanModelFactory.build(2, 1),
      AirmanModelFactory.build(3, 1),
      AirmanModelFactory.build(4, 2),
      AirmanModelFactory.build(5, 2),
      AirmanModelFactory.build(6, 2)
    ]
  },
  {
    id: 2,
    airmen: [
      AirmanModelFactory.build(7, 3),
      AirmanModelFactory.build(8, 3),
      AirmanModelFactory.build(9, 3),
      AirmanModelFactory.build(10, 4),
      AirmanModelFactory.build(11, 5),
      AirmanModelFactory.build(12, 6)
    ]
  }
];

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    // TODO: use spread operator instead of concat. ES6 FTW
    const airmen = squadrons.reduce((accum, squadron) => accum.concat(squadron.airmen), ([] as AirmanModel[]));
    return Promise.resolve(airmen);
  }

  findBySquadron(id: number) {
    const airmenForSquadron = squadrons.reduce((accum, squadron) => id === squadron.id ? squadron.airmen : accum, ([] as AirmanModel[]));
    return Promise.resolve(airmenForSquadron);
  }

  findByFlight(id: number): Promise<AirmanModel[]> {
    const airmen = squadrons.reduce((accum, squadron) => accum.concat(squadron.airmen), ([] as AirmanModel[]));
    const airmenForFlight = airmen.filter(airman => id === airman.flightId);
    return Promise.resolve(airmenForFlight);
  }
}