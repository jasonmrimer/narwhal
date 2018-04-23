import { SiteModel, SiteType } from '../models/SiteModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { FlightModel } from '../../flight/model/FlightModel';

export class SiteModelFactory {
  static buildList(amount: number, numOfChildren: number) {
    const sites = [];
    for (let i = 0; i < amount; i++) {
      sites.push(this.build(i, numOfChildren));
    }
    return sites;
  }

  static build(id: number, numOfChildren: number) {
    const site = new SiteModel(id, `Site ${id}`, [], SiteType.DMSSite, `Full Site Name ${id}`);

    for (let i = 0; i < numOfChildren; i++) {
      const squad = new SquadronModel(Number(`${id}${i}`), `Squadron ${id}${i}`, []);

      for (let j = 0; j < numOfChildren; j++) {
        const flight = new FlightModel(Number(`${id}${i}${j}`), `Flight ${id}${i}${j}`);
        squad.flights.push(flight);
      }
      site.squadrons.push(squad);
    }
    return site;
  }
}