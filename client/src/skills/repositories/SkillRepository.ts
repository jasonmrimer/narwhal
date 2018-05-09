import { QualificationModel } from '../models/QualificationModel';
import { CertificationModel } from '../models/CertificationModel';

export interface SkillRepository {
  findAllCertifications(): Promise<CertificationModel[]>;
  findAllQualifications(): Promise<QualificationModel[]>;
}
