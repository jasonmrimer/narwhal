import SiteRepository from '../SiteRepository';
import SiteModel from '../../models/SiteModel';

const sites = [
  {id: 1, name: 'Site 1'},
  {id: 2, name: 'Site 2'}
];

export default class SiteRepositoryStub implements SiteRepository {
  findAll(): Promise<SiteModel[]> {
    return Promise.resolve(sites);
  }
}
