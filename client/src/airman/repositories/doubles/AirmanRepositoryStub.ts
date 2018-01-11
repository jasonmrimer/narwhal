import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';
import CertificationModelFactory from '../../factories/CertificationModelFactory';

const squadrons = [
  {
    id: 1,
    airmen: [
      AirmanModelFactory.build(1, 1, [CertificationModelFactory.build(1)]),
      AirmanModelFactory.build(2, 1, [CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(3, 1, [CertificationModelFactory.build(3)]),
      AirmanModelFactory.build(4, 2, [CertificationModelFactory.build(1), CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(5, 2, [CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(6, 2, [CertificationModelFactory.build(3)])
    ]
  },
  {
    id: 2,
    airmen: [
      AirmanModelFactory.build(7, 3, [CertificationModelFactory.build(1)]),
      AirmanModelFactory.build(8, 3, [CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(9, 3, [CertificationModelFactory.build(3)]),
      AirmanModelFactory.build(10, 4, [CertificationModelFactory.build(1), CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(11, 5, [CertificationModelFactory.build(2)]),
      AirmanModelFactory.build(12, 6, [CertificationModelFactory.build(3)])
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
    const airmenForSquadron = squadrons.reduce(
      (accum, squad) => id === squad.id ? squad.airmen : accum, ([] as AirmanModel[]));
    return Promise.resolve(airmenForSquadron);
  }

  findByFlight(id: number): Promise<AirmanModel[]> {
    const airmen = squadrons.reduce((accum, squadron) => accum.concat(squadron.airmen), ([] as AirmanModel[]));
    const airmenForFlight = airmen.filter(airman => id === airman.flightId);
    return Promise.resolve(airmenForFlight);
  }
}