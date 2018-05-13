import { AirmanModel } from '../../airman/models/AirmanModel';

export class FlightModel {
  constructor(public id: number,
              public name: string,
							       public airmen: AirmanModel[] = [], ) {
  }
}
