import AirmanModel from '../models/AirmanModel';
import AirmanQualificationModel from '../models/AirmanQualificationModel';
import AirmanCertificationModel from '../models/AirmanCertificationModel';

interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  findBySquadron(id: number): Promise<AirmanModel[]>;

  findByFlight(id: number): Promise<AirmanModel[]>;

  saveQualification(qualification: AirmanQualificationModel): Promise<AirmanModel>;

  saveCertification(certification: AirmanCertificationModel): Promise<AirmanModel>;
}

export default AirmanRepository;