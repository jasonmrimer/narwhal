import { CertificationRepository } from '../CertificationRepository';
import { CertificationModel } from '../../models/CertificationModel';
import { CertificationModelFactory } from '../../factories/CertificationModelFactory';

export class CertificationRepositoryStub implements CertificationRepository {
  findAllCertifications(): Promise<CertificationModel[]> {
    return Promise.resolve(
      CertificationModelFactory.buildList(5, 1).concat(CertificationModelFactory.buildList(10, 2).splice(5, 5))
    );
  }

  findAllCertificationsBySiteId(siteId: number): Promise<CertificationModel[]> {
    return Promise.resolve(CertificationModelFactory.buildList(10, siteId));
  }

  findOneCertification(certificationId: number): Promise<CertificationModel> {
    return Promise.resolve(CertificationModelFactory.build(certificationId, 1));
  }

  update(certification: CertificationModel): Promise<CertificationModel> {
    return Promise.resolve(certification);
  }

  save(certification: { title: string }): Promise<CertificationModel> {
    return Promise.resolve(new CertificationModel(1, certification.title, 14));
  }
}
