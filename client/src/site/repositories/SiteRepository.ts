import SiteModel from '../models/SiteModel';

interface SiteRepository {
  findAll(): Promise<SiteModel[]>;
}

export default SiteRepository;
