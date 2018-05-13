import { SiteRepository } from '../SiteRepository';
import { SiteModel, SiteType } from '../../models/SiteModel';
import { SquadronModel } from '../../../squadron/models/SquadronModel';
import { FlightModel } from '../../../flight/model/FlightModel';

const sites = [
  new SiteModel(
    14,
    'DMS-GA',
    [
      new SquadronModel(1, 'Squad 1', [
        new FlightModel(1, 'Flight 1'),
        new FlightModel(2, 'Flight 2')
      ]),
      new SquadronModel(2, 'Squad 2', [
        new FlightModel(3, 'Flight 3'),
        new FlightModel(4, 'Flight 4')
      ])
    ],
    SiteType.DGSCoreSite,
    'DMS Georgia'
  ),
  new SiteModel(
    2,
    'DMS-MD',
    [
      new SquadronModel(3, 'Squad 3', [
        new FlightModel(5, 'Flight 5'),
        new FlightModel(6, 'Flight 6')
      ]),
      new SquadronModel(4, 'Squad 4', [
        new FlightModel(7, 'Flight 7'),
        new FlightModel(8, 'Flight 8')
      ])
    ],
    SiteType.DMSSite,
    'DMS Maryland'
  ),
  new SiteModel(
    3, '' +
    'DMS-HI',
    [
      new SquadronModel(5, 'Squad 5', [
        new FlightModel(9, 'Flight 9')
      ])
    ],
    SiteType.GuardSite,
    'DMS Hawaii'
  )
];

export class SiteRepositoryStub implements SiteRepository {
  findAll(): Promise<SiteModel[]> {
    return Promise.resolve(sites);
  }

	findOne(siteId: number): Promise<SiteModel> {
		return Promise.resolve(sites.find(s => s.id === siteId)!);
	}
}
