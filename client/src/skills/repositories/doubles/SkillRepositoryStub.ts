import { QualificationModel } from '../../models/QualificationModel';
import { CertificationModel } from '../../models/CertificationModel';
import { CertificationModelFactory } from '../../factories/CertificationModelFactory';
import { QualificationModelFactory } from '../../factories/QualificationModelFactory';
import { SkillRepository } from '../SkillRepository';

export class SkillRepositoryStub implements SkillRepository {
  findAllQualifications(): Promise<QualificationModel[]> {
    return Promise.resolve(QualificationModelFactory.buildList(10));
  }

  findAllCertifications(): Promise<CertificationModel[]> {
    return Promise.resolve(
      CertificationModelFactory.buildList(5, 1).concat(CertificationModelFactory.buildList(10, 2).splice(5, 5))
    );
  }
}
