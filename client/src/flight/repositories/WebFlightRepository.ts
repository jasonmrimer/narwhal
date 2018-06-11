import { HTTPClient } from '../../utils/HTTPClient';
import { FlightRepository } from './FlightRepository';
import { FlightModel } from '../model/FlightModel';

export class WebFlightRepository implements FlightRepository {

  constructor(private client: HTTPClient) {
  }

  async save(flight: FlightModel): Promise<FlightModel> {
    const body = JSON.stringify(flight);
    return await this.client.postJSON('/api/flights', body);
  }

  async delete(flightId: number): Promise<void> {
    return await this.client.delete('api/flights/' + flightId.toString());
  }
}
