import CertificationRepository from '../CertificationRepository';
import CertificationModel from '../../models/CertificationModel';
import CertificationModelFactory from '../../factories/CertificationModelFactory';

export default class CertificationRepositoryStub implements CertificationRepository {
  findAll(): Promise<CertificationModel[]> {
    return Promise.resolve(CertificationModelFactory.buildList(10));
  }
}
