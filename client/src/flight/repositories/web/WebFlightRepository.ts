import FlightRepository from '../FlightRepository';
import FlightModel from '../../model/FlightModel';

export default class WebFlightRepository implements FlightRepository {
  constructor(private baseUrl: string = '') {
  }

  findAll(): Promise<FlightModel[]> {
    return fetch(`${this.baseUrl}/api/flights`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}
