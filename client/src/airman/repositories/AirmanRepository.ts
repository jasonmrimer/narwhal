import AirmanModel from '../models/AirmanModel';

interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  findBySquadron(id: number): Promise<AirmanModel[]>;

  findByFlight(id: number): Promise<AirmanModel[]>;
}

export default AirmanRepository;