import { SquadronModel } from '../../squadron/models/SquadronModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { FlightModel } from '../../flight/model/FlightModel';

export type RosterListItem = AirmanModel | FlightModel | string;

export class RosterList {
  readonly list: RosterListItem[] = [];

  constructor(selectedFlightId: number | null, squadron: SquadronModel | null, airmen: AirmanModel[]) {
    if (squadron == null || selectedFlightId !== null) {
      this.list = airmen;
    } else {
      squadron.flights.forEach(flight => {
        this.list.push(flight);
        airmen.forEach(airman => {
          if (airman.flightId === flight.id) {
            this.list.push(airman);
          }
        });
        if (this.list[this.list.length - 1] === flight) {
          this.list.push('No members match your search.');
        }
      });
    }
  }

  get(index: number): RosterListItem {
    return this.list[index];
  }

  get size() {
    return this.list.length;
  }
}