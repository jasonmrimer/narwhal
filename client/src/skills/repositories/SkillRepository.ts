import { QualificationModel } from '../models/QualificationModel';
import { CertificationModel } from '../models/CertificationModel';

export interface SkillRepository {
  findAllCertifications(): Promise<CertificationModel[]>;
  findAllCertificationsBySiteId(siteId: number): Promise<CertificationModel[]>;

  findAllQualifications(): Promise<QualificationModel[]>;
}
