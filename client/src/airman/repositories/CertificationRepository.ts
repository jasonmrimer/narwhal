import CertificationModel from '../models/CertificationModel';

interface CertificationRepository {
  findAll(): Promise<CertificationModel[]>;
}

export default CertificationRepository;
