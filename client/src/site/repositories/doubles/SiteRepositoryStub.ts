import SiteRepository from '../SiteRepository';
import SiteModel from '../../models/SiteModel';
import SquadronModel from '../../../squadron/models/SquadronModel';
import FlightModel from '../../../flight/model/FlightModel';

const sites = [
  new SiteModel(1, 'Site 1', [
    new SquadronModel(1, 'Squad 1', [
      new FlightModel(1, 'Flight 1'),
      new FlightModel(2, 'Flight 2')
    ]),
    new SquadronModel(2, 'Squad 2', [
      new FlightModel(3, 'Flight 3'),
      new FlightModel(4, 'Flight 4')
    ])
  ]),
  new SiteModel(2, 'Site 2', [
    new SquadronModel(3, 'Squad 3', [
      new FlightModel(5, 'Flight 5'),
      new FlightModel(6, 'Flight 6')
    ]),
    new SquadronModel(4, 'Squad 4', [
      new FlightModel(7, 'Flight 7'),
      new FlightModel(8, 'Flight 8')
    ])
  ])
];

export default class SiteRepositoryStub implements SiteRepository {
  findAll(): Promise<SiteModel[]> {
    return Promise.resolve(sites);
  }
}
