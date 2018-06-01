import { FlightModel } from '../model/FlightModel';

export interface FlightRepository {
  save(flight: FlightModel): Promise<FlightModel>;
}