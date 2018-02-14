import { FlightModel } from '../../flight/model/FlightModel';

export class SquadronModel {
  constructor(public id: number,
              public name: string,
              public flights: FlightModel[]) {
  }

  getAllFlightIds(): number[] {
    return this.flights.map(flight => flight.id);
  }
}