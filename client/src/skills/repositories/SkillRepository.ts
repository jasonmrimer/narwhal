import { QualificationModel } from '../models/QualificationModel';
import { CertificationModel } from '../models/CertificationModel';

interface SkillRepository {
  findAllCertifications(): Promise<CertificationModel[]>;
  findAllQualifications(): Promise<QualificationModel[]>;
}

export default SkillRepository;
