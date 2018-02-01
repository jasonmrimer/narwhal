import QualificationModel from '../models/QualificationModel';

interface QualificationRepository {
  findAll(): Promise<QualificationModel[]>;
}

export default QualificationRepository;
