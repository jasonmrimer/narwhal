import AirmanModel from '../models/AirmanModel';
import AirmanQualificationModel from '../models/AirmanQualificationModel';

interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  findBySquadron(id: number): Promise<AirmanModel[]>;

  findByFlight(id: number): Promise<AirmanModel[]>;

  saveQualification(qualification: AirmanQualificationModel): Promise<AirmanModel>;
}

export default AirmanRepository;