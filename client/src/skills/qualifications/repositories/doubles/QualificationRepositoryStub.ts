import { QualificationModel } from '../../models/QualificationModel';
import { QualificationModelFactory } from '../../factories/QualificationModelFactory';
import { QualificationRepository } from '../QualificationRepository';

export class QualificationRepositoryStub implements QualificationRepository {
  findAllQualifications(): Promise<QualificationModel[]> {
    return Promise.resolve(QualificationModelFactory.buildList(10));
  }
}
