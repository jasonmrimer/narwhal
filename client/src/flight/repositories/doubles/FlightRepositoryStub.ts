import FlightModelFactory from '../../factories/FlightModelFactory';
import FlightRepository from '../FlightRepository';
import FlightModel from '../../model/FlightModel';

const flights = [
  FlightModelFactory.build(1, 1),
  FlightModelFactory.build(2, 1),
  FlightModelFactory.build(3, 2),
  FlightModelFactory.build(4, 2)
];

export default class FlightRepositoryStub implements FlightRepository {
  findAll(): Promise<FlightModel[]> {
    return Promise.resolve(flights);
  }

}
