import { AdminSiteModel } from '../../models/AdminSiteModel';
import { AdminSiteRepository } from '../AdminSiteRepository';

export class AdminSiteRepositoryStub implements AdminSiteRepository {
  findAll(): Promise<AdminSiteModel[]> {
    return Promise.resolve([
      new AdminSiteModel(1, 'siteOne'),
      new AdminSiteModel(2, 'siteTwo')
    ]);
  }
}