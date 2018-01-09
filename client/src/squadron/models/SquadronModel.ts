import FlightModel from '../../flight/model/FlightModel';

export default class SquadronModel {
  constructor(public id: number,
              public name: string,
              public flights: FlightModel[]) {
  }
}