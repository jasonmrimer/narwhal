import AirmanModel from '../models/AirmanModel';

interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  findByUnit(id: number): Promise<AirmanModel[]>;

  findByFlight(id: number): Promise<AirmanModel[]>;
}

export default AirmanRepository;