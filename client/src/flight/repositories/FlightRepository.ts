import FlightModel from '../model/FlightModel';

interface FlightRepository {
  findAll(): Promise<FlightModel[]>;
}

export default FlightRepository;
