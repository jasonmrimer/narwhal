import { CertificationModel } from '../models/CertificationModel';

export interface CertificationRepository {
  findAllCertifications(): Promise<CertificationModel[]>;

  findAllCertificationsBySiteId(siteId: number): Promise<CertificationModel[]>;

  findOneCertification(certificationId: number): Promise<CertificationModel>;

  update(certification: CertificationModel): Promise<CertificationModel>;

  save(certification: {title: string}): Promise<CertificationModel>;
}
