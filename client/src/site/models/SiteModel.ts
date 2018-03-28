import { SquadronModel } from '../../squadron/models/SquadronModel';

export enum SiteType {
  DGSCoreSite = 'DGSCoreSite',
  DMSSite = 'DMSSite',
  GuardSite = 'GuardSite'
}

export class SiteModel {
  constructor(public id: number,
              public name: string,
              public squadrons: SquadronModel[],
              public siteType: SiteType,
              public fullName: string) {
  }

  getAllFlightIds(): number[] {
    return this.squadrons
      .map(squadron => squadron.getAllFlightIds())
      .reduce((x, y) => x.concat(y), []);
  }
}
