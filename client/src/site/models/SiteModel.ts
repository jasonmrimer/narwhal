import SquadronModel from '../../squadron/models/SquadronModel';

export default class SiteModel {
  constructor(public id: number,
              public name: string,
              public squadrons: SquadronModel[]) {
  }

  getAllFlightIds(): number[] {
    return this.squadrons
      .map(squadron => squadron.getAllFlightIds())
      .reduce((x, y) => x.concat(y), []);
  }
}