import { FlightRepository } from './FlightRepository';
import { FlightModel } from '../model/FlightModel';

export class FlightRepositoryStub implements FlightRepository {
  save(flight: FlightModel): Promise<FlightModel> {
    return Promise.resolve(new FlightModel(1, flight.name, flight.squadronId));
  }
}