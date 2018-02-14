import { default as SkillRepository } from '../SkillRepository';
import { QualificationModel } from '../../models/QualificationModel';
import { CertificationModel } from '../../models/CertificationModel';
import { CertificationModelFactory } from '../../factories/CertificationModelFactory';
import { QualificationModelFactory } from '../../factories/QualificationModelFactory';

export default class SkillRepositoryStub implements SkillRepository {
  findAllQualifications(): Promise<QualificationModel[]> {
    return Promise.resolve(QualificationModelFactory.buildList(10));
  }

  findAllCertifications(): Promise<CertificationModel[]> {
    return Promise.resolve(CertificationModelFactory.buildList(10));
  }
}
