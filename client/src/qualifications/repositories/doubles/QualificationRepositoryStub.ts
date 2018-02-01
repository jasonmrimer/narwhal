import QualificationRepository from '../QualificationRepository';
import QualificationModel from '../../models/QualificationModel';

export default class QualificationRepositoryStub implements QualificationRepository {
  findAll(): Promise<QualificationModel[]> {
    return Promise.resolve([
      new QualificationModel(1, '1', '1'),
      new QualificationModel(2, '2', '2'),
      new QualificationModel(3, '3', '3'),
      new QualificationModel(4, '4', '4'),
      new QualificationModel(5, '5', '5')
    ]);
  }
}
